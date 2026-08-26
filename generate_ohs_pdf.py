#!/usr/bin/env python3
"""
Service Station OHS Compliance Platform - Statutory OHS Manual Generator Entrypoint
Calls generate_ihs_pdf.build_ihs_pdf() to generate Service_Station_IHS_Manual.pdf.
"""

from generate_ihs_pdf import build_ihs_pdf

if __name__ == "__main__":
    build_ihs_pdf(filename="Service_Station_OHS_Manual.pdf")
    build_ihs_pdf(filename="Service_Station_IHS_Manual.pdf")
