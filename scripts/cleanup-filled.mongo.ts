import mongoose from 'mongoose';

const HOURS = Number(process.env.FILLED_TTL_HOURS ?? 72);
const DRY_RUN = /^true$/i.test(process.env.DRY_RUN ?? 'false');
const uri = process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/yourdb';

const JobSchema = new mongoose.Schema(
  {
    status: String,
    filledPercent: Number,
    percentFilled: Number,
    filledAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    isVisible: Boolean,
  },
  { collection: 'jobs', timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

async function main() {
  await mongoose.connect(uri);
  const now = new Date();
  const cutoff = new Date(now.getTime() - HOURS * 60 * 60 * 1000);

  const filter = {
    $and: [
      { $or: [{ filledPercent: { $gte: 100 } }, { percentFilled: { $gte: 100 } }, { status: 'filled' }] },
      { $or: [{ filledAt: { $lte: cutoff } }, { updatedAt: { $lte: cutoff } }] },
      { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
    ],
  };

  if (DRY_RUN) {
    const count = await Job.countDocuments(filter);
    console.log(JSON.stringify({ dryRun: true, cutoff: cutoff.toISOString(), wouldClose: count }));
    return mongoose.disconnect();
  }

  const res = await Job.updateMany(filter, { $set: { status: 'expired', isVisible: false, deletedAt: now } });
  console.log(JSON.stringify({ expiredClosed: res.modifiedCount, cutoff: cutoff.toISOString(), ttlHours: HOURS }));
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exitCode = 1; });
