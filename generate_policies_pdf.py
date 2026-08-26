#!/usr/bin/env python3
"""
Service Station OHS Compliance Platform - Statutory OHS Policy Documents Generator
Refactored ReportLab script generating statutory policy documentation with multi-tenant headers/footers.
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

class PolicyCanvas(canvas.Canvas):
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
        self.setFillColor(colors.HexColor("#0284c7"))

        # Header (Top of page)
        self.drawString(36, 11 * inch - 28, f"STATUTORY POLICY: {TENANT_NAME.upper()}")
        self.drawRightString(8.5 * inch - 36, 11 * inch - 28, f"SITE CODE: {SITE_CODE}")
        self.setStrokeColor(colors.HexColor("#38bdf8"))
        self.setLineWidth(0.5)
        self.line(36, 11 * inch - 32, 8.5 * inch - 36, 11 * inch - 32)

        # Footer (Bottom of page)
        self.line(36, 42, 8.5 * inch - 36, 42)
        self.setFont("Helvetica", 8)
        self.drawString(36, 28, f"{COMPANY_LEGAL_NAME} | Mandated OHS Act 85 & SANS 10089 Policy Suite")
        self.drawRightString(8.5 * inch - 36, 28, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_policies_pdf(filename="Service_Station_OHS_Policies.pdf"):
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
        'PolicyTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        alignment=0,
        spaceAfter=8
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#0284c7'),
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

    story = []

    # Title Banner Block
    story.append(Paragraph(f"MANDATORY SERVICE STATION OHS POLICY SUITE", title_style))
    story.append(Paragraph(f"Site: {STATION_NAME} ({SITE_CODE})", body_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=12))

    # Policy 1: Emergency Forecourt Evacuation Policy
    story.append(Paragraph("Policy 1: Forecourt Emergency Evacuation & ESD Isolation", h1_style))
    story.append(Paragraph(
        "It is the mandatory policy of this service station that all forecourt attendants and retail cashiers possess "
        "unconditional authority to hit the Emergency Stop Device (ESD) button immediately upon observing liquid fuel leaks, "
        "smoke, or fire on the forecourt.", body_style
    ))
    story.append(Paragraph("Key Mandates:", body_style))
    story.append(Paragraph("1. ESD Isolation must occur within 2 seconds of threat detection.", body_style))
    story.append(Paragraph("2. Traffic blockades must be immediately deployed across entrance driveways.", body_style))
    story.append(Paragraph("3. Emergency Call to 10177 / 112 must state physical address and site code.", body_style))
    story.append(Spacer(1, 10))

    # Policy 2: Forecourt Fuel Spill Containment Policy
    story.append(Paragraph("Policy 2: Forecourt Petroleum Spill & Environmental Protection", h1_style))
    story.append(Paragraph(
        "Under SANS 10089 and environmental law, zero petroleum waste may enter stormwater drainage systems. "
        "All fuel spills must be contained using the 4-Stage Role Card protocol (Fetcher, Spade Applicator, Sweeper, Waste Disposer).", body_style
    ))
    story.append(Paragraph("Key Mandates:", body_style))
    story.append(Paragraph("• ONLY non-sparking plastic spades and static-free brooms may be used on spills.", body_style))
    story.append(Paragraph("• Absorbent peat moss granules must encapsulate all free liquid fuel before sweeping.", body_style))
    story.append(Paragraph("• Fuel-soaked waste must be sealed in heavy plastic hazardous waste bags inside drum storage.", body_style))
    story.append(Spacer(1, 10))

    # Policy 3: PASS Firefighting Protocol Policy
    story.append(Paragraph("Policy 3: PASS Portable Fire Extinguisher Operating Policy", h1_style))
    story.append(Paragraph(
        "Certified Fire Wardens must maintain quarterly inspection tags on all 9kg Dry Chemical Powder (DCP) extinguishers. "
        "Attendants must follow the PASS method (Pull pin, Aim at base, Squeeze lever, Sweep side-to-side).", body_style
    ))
    story.append(Spacer(1, 10))

    # Policy 4: Statutory Rights & POPIA Compliance
    story.append(Paragraph("Policy 4: Statutory Rights & POPIA Data Protection Policy", h1_style))
    story.append(Paragraph(
        "Under Section 14 of the OHS Act 85 of 1993, every worker has the statutory right to refuse unsafe work "
        "(e.g., dispensing fuel near naked flames or ungrounded tankers). Under POPIA Act 4 of 2013, employee SA ID numbers "
        "and medical records are protected by client-side AES-256-GCM encryption.", body_style
    ))
    story.append(Spacer(1, 15))

    # Sign-off Table
    story.append(KeepTogether([
        Paragraph("Policy Audit & Compliance Sign-Off Table", h1_style),
        Table([
            [Paragraph("<b>Role</b>", body_style), Paragraph("<b>Name & Title</b>", body_style), Paragraph("<b>Signature</b>", body_style), Paragraph("<b>Date</b>", body_style)],
            [Paragraph("16.1 Appointee", body_style), Paragraph("Station General Manager", body_style), Paragraph("_________________", body_style), Paragraph("__________", body_style)],
            [Paragraph("16.2 Appointee", body_style), Paragraph("Forecourt Supervisor", body_style), Paragraph("_________________", body_style), Paragraph("__________", body_style)],
            [Paragraph("OHS Representative", body_style), Paragraph("Certified Safety Rep", body_style), Paragraph("_________________", body_style), Paragraph("__________", body_style)],
        ], colWidths=[1.8 * inch, 2.5 * inch, 2.0 * inch, 1.1 * inch],
        style=[
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 6)
        ])
    ]))

    doc.build(story, canvasmaker=PolicyCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    build_policies_pdf()
