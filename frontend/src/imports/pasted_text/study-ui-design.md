Design a top navigation bar for a web app called StudyHub.

Logo typography (two-tone, no icon):
- Font: Syne, weight 700, size 22px
- The word "Study" uses color #0F172A in light mode / #FAFAFA in dark mode
- The word "Hub" always uses color #0EA5E9 (Sky Blue)
- No space between "Study" and "Hub"
- No logo icon or symbol, text only

Navbar layout (horizontal, full width):
- Height: 56px
- Background: #FFFFFF (light) / #18181B (dark)
- Border bottom: 1px solid rgba(15,23,42,0.08)
- Left: StudyHub logo
- Center: Navigation links — Dashboard, Tugas, Teman, Musik (font: Outfit 500, 14px)
- Right: Dark/Light mode toggle switch + user avatar circle (initials)

Dark/Light toggle:
- Pill shape toggle switch, width 44px height 24px
- Track color: #64748B (off) / #0EA5E9 (on)
- Thumb: white circle 18px

Active nav link style:
- Color: #0EA5E9
- Underline or dot indicator below the link

Fonts to use:
- Syne 700 for logo only
- Outfit 400/500 for all other text

Color palette:
- Light mode background: #F8FAFC, card: #FFFFFF, text: #0F172A, muted: #64748B
- Dark mode background: #09090B, card: #18181B, text: #FAFAFA, muted: #A1A1AA
- Accent: #0EA5E9

Style: Clean, minimal, professional SaaS dashboard. No gradients, no shadows, flat design. Whitespace-focused.

Design a Kanban board layout for a student task management web app called StudyHub.

Page background: #F8FAFC (light) / #09090B (dark)

Board layout:
- 3 equal-width columns side by side with 16px gap
- Each column width: ~340px
- Column background: #F1F5F9 (light) / #27272A (dark)
- Column border radius: 12px
- Column padding: 16px

Column headers (inside each column, top):
- Font: Syne 600, 13px
- Column 1 "Belum" — label color #64748B, badge count pill background #FFFFFF
- Column 2 "Proses" — label color #0EA5E9, badge count pill background #FFFFFF
- Column 3 "Selesai" — label color #10B981, badge count pill background #FFFFFF
- Thin divider line below header: 1px rgba(0,0,0,0.06)

Task cards inside columns:
- Background: #FFFFFF (light) / #18181B (dark)
- Border: 0.5px solid rgba(15,23,42,0.08)
- Border radius: 8px
- Padding: 10px 12px
- Font: Outfit

Show 2 example cards per column (6 cards total). Each card contains:
- Task title: Outfit 500, 13px, color #0F172A
- Task description: Outfit 400, 12px, color #64748B, 2 lines max
- Bottom row: deadline date pill (left) + action button (right)

Deadline pill:
- Normal: background #F1F5F9, text #64748B, calendar icon, 11px
- Warning H-1: background rgba(239,68,68,0.07), border rgba(239,68,68,0.25), text #EF4444, warning icon, badge "H-1" in red #EF4444 with white text, font Syne 700 10px

Action buttons on card:
- "→ Proses" or "→ Selesai": background #0EA5E9, text white, 11px Outfit 500, border radius 6px
- "← Belum" or "← Proses": background #F1F5F9, text #64748B, same size

No drag and drop visual hints. Buttons only.

Style: Professional, clean SaaS dashboard. No gradients, flat design, minimal borders.

Design two UI components for StudyHub, a student task management app:

COMPONENT A — Task Card (expanded detail view):
- Card size: 360px wide
- Background: #FFFFFF (light) / #18181B (dark)
- Border: 0.5px solid rgba(15,23,42,0.08), border radius 12px
- Padding: 16px

Contents inside the card (top to bottom):
1. Status badge pill top-right corner: "Proses" in #0EA5E9 background (light fill rgba(14,165,233,0.1)), text #0EA5E9, Outfit 500 11px
2. Task title: Outfit 600, 15px, color #0F172A / #FAFAFA
3. Task description body text: Outfit 400, 13px, color #64748B / #A1A1AA, 3 lines
4. Divider line
5. Row with: calendar icon + deadline date text (Outfit 400 12px #64748B) | clock icon + "H-1" label in red #EF4444 font Syne 700
6. Collaborators row: 3 small avatar circles (32px) stacked/overlapping, Outfit 12px "3 anggota"
7. Attached file pill: paperclip icon + filename.pdf, background #F1F5F9, text #64748B, 12px
8. Two action buttons full width: "Tandai Selesai" (background #0EA5E9, white text) | "Hapus" (border only, text #EF4444)

COMPONENT B — Add New Task Form (modal/panel):
- Width: 400px, background #FFFFFF / #18181B, border radius 16px, padding 20px
- Header: "Tugas Baru" font Syne 700 18px + X close button top right

Form fields (Outfit 400 14px labels, input border #E2E8F0 radius 8px):
1. Judul Tugas — single line text input, placeholder "Contoh: UAS Pemrograman Web"
2. Deskripsi — textarea 3 rows
3. Deadline — date picker input style
4. Status — dropdown select (Belum / Proses / Selesai)
5. Upload File — dashed border box "Klik atau drag file PDF/gambar" with upload icon center

Submit button: full width, background #0EA5E9, text white "Buat Tugas", Outfit 600 14px, border radius 8px, height 40px

Font: Syne for headings only (H-1, titles), Outfit for all inputs/labels/body text.
Style: Clean, minimal, professional. No gradients or shadows.

Design a Study Music Player widget/panel for a web app called StudyHub.

Panel size: 320px wide, placed as a sidebar panel or floating card
Background: #FFFFFF (light) / #18181B (dark)
Border: 0.5px solid rgba(15,23,42,0.08), border radius 12px
Padding: 16px

Panel header:
- Title: "Study Music" font Syne 600 14px color #0F172A / #FAFAFA
- Small badge: "via YouTube" background rgba(14,165,233,0.1) text #0EA5E9 Outfit 500 10px

Search bar:
- Full width input, height 36px
- Placeholder: "Cari musik lofi, jazz, classical..."
- Left icon: search icon 16px color #64748B
- Border: 1px solid #E2E8F0, border radius 8px
- Font: Outfit 400 13px

Song list (show 4 example items):
Each song item row:
- Height: 48px, padding 8px
- Thumbnail square 36x36px, border radius 6px, filled with a neutral gray placeholder
- Song title: Outfit 500 13px color #0F172A / #FAFAFA, 1 line truncated
- Duration: Outfit 400 11px color #64748B, right aligned
- Active/playing row: left border 2px solid #0EA5E9, background rgba(14,165,233,0.05)
- Hover: background #F8FAFC / #27272A

Player controls bar (bottom of panel):
- Background: #F8FAFC (light) / #27272A (dark)
- Border radius: 0 0 12px 12px
- Padding: 10px 14px
- Now playing: thumbnail 32px + song title Outfit 500 12px truncated
- Controls center: Previous | Play/Pause (filled circle 32px #0EA5E9 white icon) | Next
- All control icons: 18px

Font: Syne 600 for "Study Music" title only. Outfit for everything else.
Color palette:
- Primary accent: #0EA5E9
- Text: #0F172A / #FAFAFA
- Muted text: #64748B / #A1A1AA
- Background: #FFFFFF / #18181B

Style: Compact, minimal, professional. Not a gaming/esports look. Clean white card aesthetic. No gradients, no glow effects.