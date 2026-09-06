import re

with open('src/app/(intern)/intern/intern-client.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update React import
content = content.replace(
    'import { useMemo, useState } from "react";',
    'import { createContext, useContext, useMemo, useState } from "react";'
)

# 2. Add Context
context_code = '''
export const InternContext = createContext<{ internName: string, internDepartment: string, internInitials: string }>({ internName: "", internDepartment: "", internInitials: "" });
'''
content = content.replace('type Page =', context_code + '\ntype Page =')

# 3. Modify App -> InternClient
app_code = '''
export function InternClient({
  initialTasks,
  internName,
  internDepartment,
  internInitials,
}: {
  initialTasks: Task[];
  internName: string;
  internDepartment: string;
  internInitials: string;
}) {
'''
content = re.sub(r'export default function App\(\) \{', app_code, content)

# Remove initialTasks hardcoded array
content = re.sub(r'const initialTasks: Task\[\] = \[[\s\S]*?\];\n', '', content)

# 4. Wrap with Provider
content = content.replace(
    'return <div className="min-h-screen bg-[#f5f8fb] font-[\'Plus_Jakarta_Sans\',ui-sans-serif,system-ui,sans-serif] text-[#142a47]">',
    'return <InternContext.Provider value={{ internName, internDepartment, internInitials }}><div className="min-h-screen bg-[#f5f8fb] font-[\'Plus_Jakarta_Sans\',ui-sans-serif,system-ui,sans-serif] text-[#142a47]">'
)
content = re.sub(r'</div>;\n}$', '</div></InternContext.Provider>;\n}', content)

# 5. Fix usages
# In Avatar:
avatar_code = '''function Avatar({ size = "md", initials }: { size?: "sm" | "md" | "lg"; initials?: string }) {
  const { internInitials } = useContext(InternContext);
  const displayInitials = initials || internInitials;
  const dimensions = { sm: "h-8 w-8 text-[10px]", md: "h-10 w-10 text-xs", lg: "h-14 w-14 text-base" };
  return <div className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a9c98] to-[#1675bb] font-bold text-white shadow-sm ${dimensions[size]}`}>{displayInitials}</div>;
}'''
content = re.sub(r'function Avatar\(\{.*?\}\) \{[\s\S]*?return <div.*?</div>;\n\}', avatar_code, content)

# In Sidebar:
sidebar_replace = '''function Sidebar({ activePage, onNavigate, mobile = false, onClose }: { activePage: Page; onNavigate: (page: Page) => void; mobile?: boolean; onClose?: () => void }) {
  const { internName, internDepartment } = useContext(InternContext);
  const navigate = (page: Page) => { onNavigate(page); onClose?.(); };'''
content = re.sub(r'function Sidebar\(\{.*?\}\) \{[\s\S]*?const navigate.*?;\n', sidebar_replace + '\n', content)
content = content.replace('Ayesha Khan', '{internName}').replace('Process Engineering', '{internDepartment}')

# Overview:
overview_replace = '''function Overview({ tasks, onNavigate, onTaskSelect }: { tasks: Task[]; onNavigate: (page: Page) => void; onTaskSelect: (task: Task) => void }) {
  const { internName } = useContext(InternContext);'''
content = re.sub(r'function Overview\(\{.*?\}\) \{', overview_replace, content)
content = content.replace('Good morning, Ayesha.', 'Good morning, {internName.split(" ")[0]}.')

with open('src/app/(intern)/intern/intern-client.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Client component updated")
