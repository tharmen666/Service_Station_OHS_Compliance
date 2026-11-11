#!/usr/bin/env python3
"""
Service Station OHS Compliance Platform - Multi-Tenant Occupational Health & Safety (OHS) Manual Generator
Refactored ReportLab script generating audit-ready PDF documentation with dynamic .env.local tenant settings.
"""

import sys
import os

def load_env_local():
    """Reads .env.local if present and populates os.environ."""
    env_paths = [".env.local", ".env.white-label.template", ".env"]
    for path in env_paths:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip().strip('"').strip("'")
                        if key not in os.environ:
                            os.environ[key] = val

load_env_local()

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

# Multi-Tenant Site Configuration Parsed from Environment
TENANT_NAME = os.getenv("VITE_WHITE_LABEL_BRAND_NAME", "Brilliant Group One — Central Depot Fleet")
SITE_CODE = os.getenv("VITE_TENANT_ID", os.getenv("VITE_STATION_SITE_CODE", "STN-ALPHA"))
STATION_NAME = os.getenv("VITE_TENANT_SITE_NAME", os.getenv("VITE_STATION_NAME", "Retail Service Station Alpha"))
LOCATION = os.getenv("VITE_TENANT_LOCATION", "Regional Logistics Corridor 1, Gauteng")
COMPANY_LEGAL_NAME = os.getenv("VITE_WHITE_LABEL_COMPANY_LEGAL_NAME", f"{TENANT_NAME} ({LOCATION})")
EMERGENCY_CONTACT = os.getenv("VITE_EMERGENCY_CONTACT", "+27 11 800 1000 / 10177")
PRIMARY_COLOR_HEX = os.getenv("VITE_TENANT_PRIMARY_COLOR", "#005A9C")
SECONDARY_COLOR_HEX = os.getenv("VITE_TENANT_SECONDARY_COLOR", "#ED1C24")

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
        self.setFillColor(colors.HexColor(PRIMARY_COLOR_HEX))

        # Header (Top of page)
        self.drawString(36, 11 * inch - 28, f"STATUTORY MANUAL: {TENANT_NAME.upper()}")
        self.drawRightString(8.5 * inch - 36, 11 * inch - 28, f"SITE CODE: {SITE_CODE}")
        self.setStrokeColor(colors.HexColor(PRIMARY_COLOR_HEX))
        self.setLineWidth(0.75)
        self.line(36, 11 * inch - 32, 8.5 * inch - 36, 11 * inch - 32)

        # Footer (Bottom of page)
        self.line(36, 42, 8.5 * inch - 36, 42)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#475569"))
        self.drawString(36, 28, f"{COMPANY_LEGAL_NAME} | OHS Act 85 & SANS 10089 ESD Enforced")
        self.drawRightString(8.5 * inch - 36, 28, f"Created by Desigan Tharmen | Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_ohs_pdf(filename="Service_Station_OHS_Manual.pdf"):
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
        fontSize=18,
        leading=22,
        textColor=colors.HexColor(PRIMARY_COLOR_HEX),
        alignment=0,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor(SECONDARY_COLOR_HEX),
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor(PRIMARY_COLOR_HEX),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        spaceAfter=4
    )

    story = []

    # Title Banner Block
    story.append(Paragraph(f"OCCUPATIONAL HEALTH & SAFETY (OHS) COMPLIANCE MANUAL", title_style))
    story.append(Paragraph(f"Site: {STATION_NAME} | Code: {SITE_CODE} | Location: {LOCATION}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor(SECONDARY_COLOR_HEX), spaceAfter=12))

    # Section 1: Executive Site Profile & Statutory Registration
    story.append(Paragraph("1. Executive Site Profile & Legal Registration", h1_style))
    site_table_data = [
        [Paragraph("<b>Tenant Brand Name:</b>", body_style), Paragraph(TENANT_NAME, body_style)],
        [Paragraph("<b>Forecourt Network Site:</b>", body_style), Paragraph(STATION_NAME, body_style)],
        [Paragraph("<b>Location / Physical Address:</b>", body_style), Paragraph(LOCATION, body_style)],
        [Paragraph("<b>Site Regulatory Code:</b>", body_style), Paragraph(SITE_CODE, body_style)],
        [Paragraph("<b>Statutory Oversight:</b>", body_style), Paragraph("OHS Act 85 of 1993, Section 16.1 & 16.2 Appointees", body_style)],
        [Paragraph("<b>Emergency Line:</b>", body_style), Paragraph(EMERGENCY_CONTACT, body_style)],
    ]
    t_site = Table(site_table_data, colWidths=[2.2 * inch, 5.2 * inch])
    t_site.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_site)
    story.append(Spacer(1, 12))

    # Section 2: Statutory Compliance Mandates & SANS 10089 ESD
    story.append(Paragraph("2. Statutory Mandates & SANS 10089 Forecourt Standards", h1_style))
    story.append(Paragraph("This manual establishes mandatory compliance under South African occupational safety law:", body_style))
    story.append(Paragraph("• <b>OHS Act 85 of 1993 (Section 8):</b> General duties of employers to provide a safe working environment on all forecourt fuel dispenser islands and retail stores.", bullet_style))
    story.append(Paragraph("• <b>SANS 10089 Parts 1 & 3 (ESD Policy Enforced):</b> Bulk petroleum handling, dispenser hydraulics, mandatory static bonding during fuel offloading, and 2-second Emergency Stop Device (ESD) isolation.", bullet_style))
    story.append(Paragraph("• <b>POPIA (Act 4 of 2013):</b> AES-256-GCM client-side encryption of employee SA ID numbers and incident log signatures.", bullet_style))
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
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor(PRIMARY_COLOR_HEX)),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_sec24)
    story.append(Spacer(1, 12))

    # Section 4: 4-Stage Emergency Forecourt Procedures
    story.append(Paragraph("4. Emergency Forecourt Action Procedures", h1_style))
    story.append(Paragraph("<b>4.1 Emergency Forecourt Evacuation Protocol:</b>", body_style))
    story.append(Paragraph("1. Hit Emergency Stop Device (ESD) button on island or counter immediately.", bullet_style))
    story.append(Paragraph("2. Deploy traffic cones across forecourt entrance driveways.", bullet_style))
    story.append(Paragraph("3. Dial 10177 / 112 from landline with site code.", bullet_style))
    story.append(Paragraph("4. Position certified Fire Warden upwind with 9kg DCP Extinguisher.", bullet_style))
    story.append(Paragraph("5. Sweep Quick Shop and restrooms; evacuate to Assembly Point.", bullet_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>4.2 4-Stage Forecourt Fuel Spill Containment Protocol:</b>", body_style))
    story.append(Paragraph("• <b>Role 1 (Fetcher):</b> Don nitrile gloves + safety goggles; lay booms around storm drain grates.", bullet_style))
    story.append(Paragraph("• <b>Role 2 (Spade Applicator):</b> Apply non-sparking plastic spade to spread peat moss / absorbent granules.", bullet_style))
    story.append(Paragraph("• <b>Role 3 (Sweeper):</b> Sweep encapsulated granules into centralized piles using soft non-static brooms.", bullet_style))
    story.append(Paragraph("• <b>Role 4 (Waste Disposer):</b> Seal waste into marked hazardous waste bags and deposit into drum.", bullet_style))
    story.append(Spacer(1, 12))

    # Sign-off Block
    story.append(KeepTogether([
        Paragraph("5. Statutory Verification Sign-Off", h1_style),
        Table([
            [Paragraph("<b>Station General Manager:</b> ___________________________", body_style), Paragraph("<b>Date:</b> ______________", body_style)],
            [Paragraph("<b>OHS Representative (Sec 17):</b> _________________________", body_style), Paragraph("<b>Date:</b> ______________", body_style)],
        ], colWidths=[5.2 * inch, 2.2 * inch], style=[('PADDING', (0,0), (-1,-1), 6)])
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

# Backward-compatibility alias
build_ihs_pdf = build_ohs_pdf

if __name__ == "__main__":
    build_ohs_pdf()
