#!/usr/bin/env python3
"""
Service Station OHS Compliance Platform - Multi-Tenant Integrated Health & Safety (IHS) Manual Generator
Refactored ReportLab script generating audit-ready PDF documentation with multi-tenant headers/footers.
"""

import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

# Multi-Tenant Site Configuration Defaults
TENANT_NAME = os.getenv("VITE_WHITE_LABEL_BRAND_NAME", "Apex Energy Forecourt Compliance Portal")
COMPANY_LEGAL_NAME = os.getenv("VITE_WHITE_LABEL_COMPANY_LEGAL_NAME", "Apex Petroleum Retailers (Pty) Ltd")
SITE_CODE = os.getenv("VITE_STATION_SITE_CODE", "ZA-OHS-40921")
STATION_NAME = os.getenv("VITE_STATION_NAME", "Apex Station Forecourt #104")
EMERGENCY_CONTACT = os.getenv("VITE_EMERGENCY_CONTACT", "+27 11 999 0100 / 10177")

class NumberedCanvas(canvas.Canvas):
    """Multi-tenant canvas with custom running headers and footers."""
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
        self.setFillColor(colors.HexColor("#475569"))

        # Header (Top of page)
        self.drawString(36, 11 * inch - 28, f"STATUTORY MANUAL: {TENANT_NAME.upper()}")
        self.drawRightString(8.5 * inch - 36, 11 * inch - 28, f"SITE CODE: {SITE_CODE}")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(36, 11 * inch - 32, 8.5 * inch - 36, 11 * inch - 32)

        # Footer (Bottom of page)
        self.line(36, 42, 8.5 * inch - 36, 42)
        self.setFont("Helvetica", 8)
        self.drawString(36, 28, f"{COMPANY_LEGAL_NAME} | OHS Act 85 of 1993 & SANS 10089 Compliant")
        self.drawRightString(8.5 * inch - 36, 28, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_ihs_pdf(filename="Service_Station_IHS_Manual.pdf"):
    doc = SimpleDocTemplate(
        filename,
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
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        alignment=0,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#d97706'),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=14,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        spaceAfter=4
    )

    story = []

    # Title Banner Block
    story.append(Paragraph(f"INTEGRATED HEALTH & SAFETY (IHS) MANUAL", title_style))
    story.append(Paragraph(f"Site: {STATION_NAME} ({SITE_CODE}) | Fuel Brand: Shell / Engen / Multi-Tenant", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#f59e0b"), spaceAfter=15))

    # Section 1: Executive Site Profile & Statutory Registration
    story.append(Paragraph("1. Executive Site Profile & Legal Registration", h1_style))
    site_table_data = [
        [Paragraph("<b>Station Name:</b>", body_style), Paragraph(STATION_NAME, body_style)],
        [Paragraph("<b>Company Legal Entity:</b>", body_style), Paragraph(COMPANY_LEGAL_NAME, body_style)],
        [Paragraph("<b>Site Regulatory Code:</b>", body_style), Paragraph(SITE_CODE, body_style)],
        [Paragraph("<b>Statutory Oversight:</b>", body_style), Paragraph("OHS Act 85 of 1993, Section 16.1 & 16.2 Appointees", body_style)],
        [Paragraph("<b>24/7 Emergency Line:</b>", body_style), Paragraph(EMERGENCY_CONTACT, body_style)],
    ]
    t_site = Table(site_table_data, colWidths=[2.2 * inch, 5.2 * inch])
    t_site.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_site)
    story.append(Spacer(1, 15))

    # Section 2: Statutory Compliance Mandates
    story.append(Paragraph("2. Statutory Mandates & SANS 10089 Forecourt Standards", h1_style))
    story.append(Paragraph("This manual establishes mandatory compliance under South African occupational safety law:", body_style))
    story.append(Paragraph("• <b>OHS Act 85 of 1993 (Section 8):</b> General duties of employers to ensure all forecourt operations, fuel dispensing, and retail store activities are safe without risk to workers or customers.", bullet_style))
    story.append(Paragraph("• <b>SANS 10089 (Parts 1 & 3):</b> South African National Standard governing bulk petroleum storage, underground tanks, dispenser hydraulics, static bonding during fuel offloading, and mandatory ESD (Emergency Stop Device) switches.", bullet_style))
    story.append(Paragraph("• <b>POPIA (Act 4 of 2013):</b> Mandatory client-side AES-256-GCM encryption of employee SA ID numbers and incident log signatures.", bullet_style))
    story.append(Spacer(1, 10))

    # Section 3: Section 24 Incident Escalation Protocol
    story.append(Paragraph("3. Section 24 Statutory Incident Escalation Workflow", h1_style))
    sec24_data = [
        [Paragraph("<b>Incident Severity Level</b>", body_style), Paragraph("<b>Mandatory Notification Window</b>", body_style), Paragraph("<b>Regulatory Body & Form</b>", body_style)],
        [Paragraph("<b>Fatality / Structural Collapse</b>", body_style), Paragraph("IMMEDIATE (Within 1 Hour)", body_style), Paragraph("Dept of Employment & Labour + SAPS (Form WCL 1)", body_style)],
        [Paragraph("<b>Major Fuel Spill (>200L) / Fire ESD</b>", body_style), Paragraph("Within 24 Hours", body_style), Paragraph("Provincial Environmental Inspectorate + District Fire", body_style)],
        [Paragraph("<b>Medical Treatment / Lost Time (>14 days)</b>", body_style), Paragraph("Within 7 Days", body_style), Paragraph("Provincial Director: Labour (Form WCL 2)", body_style)],
    ]
    t_sec24 = Table(sec24_data, colWidths=[2.5 * inch, 2.3 * inch, 2.6 * inch])
    t_sec24.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_sec24)
    story.append(Spacer(1, 15))

    # Section 4: 4-Stage Emergency Forecourt Procedures
    story.append(Paragraph("4. Emergency Forecourt Action Procedures", h1_style))
    story.append(Paragraph("<b>4.1 Emergency Forecourt Evacuation Protocol:</b>", body_style))
    story.append(Paragraph("1. Hit Emergency Stop Device (ESD) button on island or counter immediately.", bullet_style))
    story.append(Paragraph("2. Deploy traffic cones across forecourt entrance driveways.", bullet_style))
    story.append(Paragraph("3. Dial 10177 / 112 from landline with site code.", bullet_style))
    story.append(Paragraph("4. Position certified Fire Warden upwind with 9kg DCP Extinguisher.", bullet_style))
    story.append(Paragraph("5. Sweep Quick Shop and restrooms; evacuate to Assembly Point.", bullet_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>4.2 4-Stage Forecourt Fuel Spill Containment Protocol:</b>", body_style))
    story.append(Paragraph("• <b>Role 1 (Fetcher):</b> Don nitrile gloves + safety goggles; lay booms around storm drain grates.", bullet_style))
    story.append(Paragraph("• <b>Role 2 (Spade Applicator):</b> Apply non-sparking plastic spade to spread peat moss / absorbent granules.", bullet_style))
    story.append(Paragraph("• <b>Role 3 (Sweeper):</b> Sweep encapsulated granules into centralized piles using soft non-static brooms.", bullet_style))
    story.append(Paragraph("• <b>Role 4 (Waste Disposer):</b> Seal waste into marked hazardous waste bags and deposit into drum.", bullet_style))
    story.append(Spacer(1, 15))

    # Sign-off Block
    story.append(KeepTogether([
        Paragraph("5. Statutory Verification Sign-Off", h1_style),
        Table([
            [Paragraph("<b>Station General Manager:</b> ___________________________", body_style), Paragraph("<b>Date:</b> ______________", body_style)],
            [Paragraph("<b>OHS Representative (Sec 17):</b> _________________________", body_style), Paragraph("<b>Date:</b> ______________", body_style)],
        ], colWidths=[5.2 * inch, 2.2 * inch], style=[('PADDING', (0,0), (-1,-1), 8)])
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    build_ihs_pdf()
