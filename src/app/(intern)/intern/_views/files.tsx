"use client";

import { FileText, MoreHorizontal, Search, SlidersHorizontal, Upload } from "lucide-react";
import { FolderTile } from "../_components";

export function FilesPage() {
  const files = [["Weekly progress report template.docx", "Document", "240 KB", "Yesterday", "doc"], ["Separator train data pack.xlsx", "Spreadsheet", "1.8 MB", "24 Sep 2026", "xlsx"], ["HSE site induction checklist.pdf", "PDF", "2.1 MB", "22 Sep 2026", "pdf"], ["Process engineering orientation.pptx", "Presentation", "4.7 MB", "18 Sep 2026", "ppt"]] as const;
  const iconColor: Record<string, string> = { doc: "bg-[#edf5ff] text-[#357cc3]", xlsx: "bg-[#e8f8ee] text-[#3d9b69]", pdf: "bg-[#fff0ef] text-[#d56760]", ppt: "bg-[#fff4e8] text-[#db8439]" };
  return <div className="animate-enter">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-[#0c9f99]">Resources</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">My files</h1><p className="mt-2 text-[15px] text-[#6981a3]">Your work, learning materials and shared department resources.</p></div>
      <button className="inline-flex items-center gap-2 self-start rounded-xl bg-[#0d9f99] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,159,153,0.2)]"><Upload className="h-4 w-4" /> Upload file</button>
    </section>
    <div className="mt-7 grid gap-4 sm:grid-cols-3">
      <FolderTile title="Supervisor shared" count="8 files" people />
      <FolderTile title="My reports" count="3 files" />
      <FolderTile title="Learning resources" count="12 files" />
    </div>
    <div className="mt-7 overflow-hidden rounded-[20px] border border-[#e0e8f1] bg-white shadow-[0_8px_22px_rgba(30,62,100,0.035)]">
      <div className="flex flex-col gap-3 border-b border-[#e8eef4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="text-[17px] font-bold text-[#17304f]">All files</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-[#f4f7fb] px-3 py-2 text-xs text-[#8498b2]"><Search className="h-3.5 w-3.5" />Search files</div>
          <button className="rounded-lg border border-[#dfe8f0] p-2 text-[#6981a1]"><SlidersHorizontal className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="hidden grid-cols-[1.7fr_1fr_100px_130px_30px] gap-4 border-b border-[#e8eef4] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#91a3bd] md:grid"><p>Name</p><p>Type</p><p>Size</p><p>Modified</p><span /></div>
      {files.map(([name, type, size, date, icon]) => (
        <button key={name} className="grid w-full items-center gap-3 border-b border-[#e8eef4] px-5 py-4 text-left transition hover:bg-[#f8fbfc] md:grid-cols-[1.7fr_1fr_100px_130px_30px] md:gap-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${iconColor[icon]}`}><FileText className="h-4 w-4" /></div>
            <p className="truncate text-sm font-bold text-[#1d3755]">{name}</p>
          </div>
          <p className="hidden text-xs text-[#7187a5] md:block">{type}</p>
          <p className="hidden text-xs text-[#7187a5] md:block">{size}</p>
          <p className="hidden text-xs text-[#7187a5] md:block">{date}</p>
          <MoreHorizontal className="h-4 w-4 justify-self-end text-[#90a3ba]" />
        </button>
      ))}
    </div>
  </div>;
}