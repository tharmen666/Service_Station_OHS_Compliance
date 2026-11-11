#!/usr/bin/env python3
"""
Service Station OHS Compliance Platform - Statutory OHS Manual Generator Entrypoint
Calls generate_ihs_pdf.build_ohs_pdf() to generate Service_Station_OHS_Manual.pdf.
"""

from generate_ihs_pdf import build_ohs_pdf

if __name__ == "__main__":
    build_ohs_pdf(filename="Service_Station_OHS_Manual.pdf")
