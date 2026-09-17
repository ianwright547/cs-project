export type FileEntry = { path: string; absolutePath: string; directory: boolean };
export type CommandRecord = { command: string; failed: boolean; output?: string; cwd?: string };
export type WorkspaceView = { cwd: string; files: FileEntry[]; saved: boolean; output: string; exitCode: number; fixture: boolean; branch: string; pending?: string };
export type Platform = 'mac' | 'linux' | 'windows';
export type Commit = { id: string; message: string; files: Record<string, string>; parents: string[] };
export type Fixture = {
  cwd: string; directories?: string[]; files?: Record<string, string>; repo?: string;
  commits?: { id?: string; message: string; files: Record<string, string>; parents?: string[] }[];
  staged?: Record<string, string>; working?: Record<string, string>; setup?: string[][];
  branch?: string; branches?: string[]; branchTips?: Record<string, string>; remotes?: Record<string, string>;
  remoteTips?: Record<string, string>; tags?: string[]; reflog?: string[]; note?: string;
  merge?: { source: string; conflicts: string[] };
};
export type WorkspaceSnapshot = {
  cwd: string; files: Record<string, string>; directories: string[]; repo?: string;
  tracked: string[]; staged: string[]; index: Record<string, string | null>;
  commits: { id: string; message: string; files: Record<string, string>; parents?: string[] }[];
  head: string; branch: string; branches: string[]; remotes: Record<string, string>;
  tags: string[]; stashCount: number; conflicts?: string[]; branchTips?: Record<string, string>; remoteTips?: Record<string, string>; aliases?: Record<string, string>;
};
