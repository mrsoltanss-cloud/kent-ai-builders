"use client";
import React from "react";

/** Temporary shim: keeps layout from breaking without changing UI logic */
export function SideNav() {
  return <div data-sidenav-shim style={{ display: "contents" }} />;
}
