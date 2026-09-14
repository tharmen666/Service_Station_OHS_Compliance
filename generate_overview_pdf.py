#!/usr/bin/env python3
"""
Generates an Executive & Technical Overview PDF for the Service Station OHS Compliance Platform directly onto the user's Desktop.
"""

import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

DESKTOP_PATH = r"C:\Users\Desigan Tharmen\Desktop\Service_Station_OHS_Overview.pdf"

PRIMARY_COLOR = colors.HexColor("#005A9C")
SECONDARY_COLOR = colors.HexColor("#ED1C24")
ACCENT_COLOR = colors.HexColor("#0f172a")
BODY_COLOR = colors.HexColor("#334155")
BG_LIGHT = colors.HexColor("#f8fafc")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(PRIMARY_COLOR)

        # Header
        self.drawString(36, 11 * inch - 28, "SERVICE STATION OHS COMPLIANCE PLATFORM")
        self.drawRightString(8.5 * inch - 36, 11 * inch - 28, "EXECUTIVE & TECHNICAL OVERVIEW")
        self.setStrokeColor(PRIMARY_COLOR)
        self.setLineWidth(0.75)
        self.line(36, 11 * inch - 32, 8.5 * inch - 36, 11 * inch - 32)

        # Footer
        self.line(36, 42, 8.5 * inch - 36, 42)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(36, 28, "South African OHS Act 85 of 1993 & SANS 10089 Compliance Standard")
        self.drawRightString(8.5 * inch - 36, 28, f"Created by Desigan Tharmen | Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_pdf(target_file=DESKTOP_PATH):
    doc = SimpleDocTemplate(
        target_file,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY_COLOR,
        alignment=0,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=SECONDARY_COLOR,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=PRIMARY_COLOR,
        spaceBefore=10,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=ACCENT_COLOR,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=BODY_COLOR,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=12,
        spaceAfter=3
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("SERVICE STATION OHS COMPLIANCE PLATFORM", title_style))
    story.append(Paragraph("Executive Overview & Technical Architecture Reference Document", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY_COLOR, spaceAfter=10))

    # --- PART 1: SIMPLE ONE-PAGER EXPLANATION ---
    story.append(Paragraph("Part 1: Simple Overview (What This App Does)", h1_style))
    
    exec_summary_text = (
        "The <b>Service Station OHS Compliance Platform</b> is an all-in-one digital safety and statutory "
        "compliance system designed for South African retail fuel service stations (Engen, Shell, BP, TotalEnergies, "
        "and Sasol). Built specifically for forecourt managers, cashiers, and attendants, it replaces paper safety manuals "
        "with an interactive, audit-ready tablet platform enforcing real-time safety compliance, emergency readiness, "
        "and statutory reporting."
    )
    story.append(Paragraph(exec_summary_text, body_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Key System Capabilities & Forecourt Modules:", h2_style))
    
    features = [
        ("🚨 Emergency Response & Evacuation (9-Step Protocol):", 
         "Guides forecourt staff step-by-step through Emergency Stop (ESD) button activation, panic prevention, customer sweeps, engine shut-offs, and upwind assembly roll call. Features an interactive ESD Alarm Siren simulator and lightbox posters."),
        
        ("⛽ Fuel Spill Containment (8 Steps & 4 Attendant Roles):", 
         "Enforces an 8-stage spill clean-up process and 4 synchronized role cards: <b>Role 1 (Fetcher)</b> (booms & spill kit), <b>Role 2 (Plastic Spade Applicator)</b> (peat moss absorbent), <b>Role 3 (Sweeper)</b> (encapsulation), and <b>Role 4 (Waste Disposer)</b> (hazardous waste drumming). Enforces a strict <i>Non-Sparking Plastic Tool Mandate</i>."),
        
        ("🔥 PASS Firefighting & Fuel Safety:", 
         "Interactive training on using 9kg Dry Chemical Powder (DCP) extinguishers on Class B fuel fires using the PASS technique (Pull, Aim, Squeeze, Sweep)."),
        
        ("📋 Autonomous Statutory Document Generator:", 
         "Instantly generates audit-ready <b>HIRA</b> (Hazard Identification & Risk Assessment), <b>SWP</b> (Safe Work Procedures), and <b>Section 24 Incident Reports</b> grounded in SA OHS Act 85 of 1993."),
        
        ("📝 RSD 26 Fuel Tanker Offloading Checklist:", 
         "Digital inspection checklist ensuring static bonding straps are attached, ullage levels verified, and emergency shut-offs tested before fuel offloading."),
        
        ("🏆 Employee Assessment & Certified Audit Ledger:", 
         "40-question randomized safety quiz with instant video remediation pointers and POPIA-compliant digital certificate generation."),
        
        ("🏢 Multi-Tenant White-Label Branding:", 
         "Instantly switches branding, color themes, and site codes between major fuel networks (Engen, Shell, BP, TotalEnergies, Sasol).")
    ]

    for title, desc in features:
        story.append(Paragraph(f"• <b>{title}</b> {desc}", bullet_style))

    story.append(Spacer(1, 10))

    # --- PART 2: TECHNICAL ARCHITECTURE ---
    story.append(Paragraph("Part 2: Technical Architecture & System Design", h1_style))

    # Tech Stack Table
    tech_table_data = [
        [Paragraph("<b>Layer</b>", body_style), Paragraph("<b>Technology</b>", body_style), Paragraph("<b>Role / Purpose</b>", body_style)],
        [Paragraph("<b>Frontend Framework</b>", body_style), Paragraph("React 18 (TypeScript 5)", body_style), Paragraph("Component-based UI with strict type safety", body_style)],
        [Paragraph("<b>Build Tool & Bundler</b>", body_style), Paragraph("Vite 5", body_style), Paragraph("High-speed ES module dev server & Rollup bundle build", body_style)],
        [Paragraph("<b>Styling & Design</b>", body_style), Paragraph("TailwindCSS 3 + CSS", body_style), Paragraph("Dark-mode forecourt UI with glassmorphic cards", body_style)],
        [Paragraph("<b>Icons</b>", body_style), Paragraph("Lucide React", body_style), Paragraph("Scalable SVG vector iconography", body_style)],
        [Paragraph("<b>Cryptography & Security</b>", body_style), Paragraph("Web Crypto API (AES-256-GCM)", body_style), Paragraph("Client-side POPIA encryption for SA ID & signatures", body_style)],
        [Paragraph("<b>PDF Engine</b>", body_style), Paragraph("Python 3 + ReportLab", body_style), Paragraph("Dynamic PDF manual compilation (`generate_ihs_pdf.py`)", body_style)],
        [Paragraph("<b>Hosting & Deployment</b>", body_style), Paragraph("Vercel + GitHub Actions", body_style), Paragraph("Continuous integration & automated deployment", body_style)],
    ]

    t_tech = Table(tech_table_data, colWidths=[1.8 * inch, 2.2 * inch, 3.4 * inch])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Core Technical Highlights:", h2_style))

    tech_highlights = [
        ("Client-Side POPIA AES-256-GCM Cryptography:", 
         "Located in <code>src/popiActCompliance.ts</code>. Uses native <code>window.crypto.subtle</code> with AES-256-GCM encryption and 96-bit initialization vectors (IV) to encrypt employee SA ID numbers and audit log signatures before storage or export."),
        
        ("Autonomous Statutory AI Engine (Temp 0.0 Lock):", 
         "Located in <code>src/components/StatutoryDocGeneratorModal.tsx</code>. Enforces a strict <code>temperature: 0.0</code> model configuration to eliminate AI hallucinations during legal OHS document generation."),
        
        ("Multi-Tenant Pub-Sub Architecture:", 
         "Located in <code>src/multiTenantConfig.ts</code>. Utilizes a lightweight pub-sub state listener (<code>subscribeTenantChange</code>) enabling instant white-label brand switching across the app without page reloads."),
        
        ("Standalone Python ReportLab PDF Generator:", 
         "Located in <code>generate_ihs_pdf.py</code>. Uses ReportLab's <code>SimpleDocTemplate</code> with custom <code>NumberedCanvas</code> header/footer callbacks to dynamically compile audit-ready PDF manuals based on <code>.env.local</code> tenant configuration.")
    ]

    for title, desc in tech_highlights:
        story.append(Paragraph(f"• <b>{title}</b> {desc}", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {target_file}")

if __name__ == "__main__":
    build_pdf()
