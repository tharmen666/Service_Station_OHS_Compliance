export interface EvacuationStepData {
  step: number;
  action: string;
  detail: string;
}

export interface SpillStepData {
  step: number;
  title: string;
  detail: string;
}

export interface EvacuationProtocol {
  title: string;
  motto: string;
  steps: EvacuationStepData[];
}

export interface SpillResponseProtocol {
  title: string;
  motto: string;
  steps: SpillStepData[];
}

export interface EmergencyProtocols {
  evacuation: EvacuationProtocol;
  spillResponse: SpillResponseProtocol;
}

export const emergencyProtocols: EmergencyProtocols = {
  evacuation: {
    title: "Emergency Response & Evacuation Steps (Service Stations)",
    motto: "REMEMBER TO STAY CALM",
    steps: [
      {
        step: 1,
        action: "Emergency Stop Activation",
        detail: "Cashier presses the emergency stop button immediately to isolate all forecourt fuel dispensers and cut submersible pump power."
      },
      {
        step: 2,
        action: "Traffic Control Deployment",
        detail: "Designated team members (2x staff) immediately secure the site entrance and exit to halt incoming traffic and clear the driveway."
      },
      {
        step: 3,
        action: "Fire Suppression Team",
        detail: "Two to three trained staff members confidently attack the fire using appropriate 9kg DCP or CO2 fire extinguishers."
      },
      {
        step: 4,
        action: "Customer Assembly Direction",
        detail: "Remaining forecourt staff instruct customers to switch off vehicle engines immediately and guide them calmly to the designated assembly point."
      },
      {
        step: 5,
        action: "Internal Notification",
        detail: "Cashier alerts store management and all staff inside the building to initiate immediate interior evacuation."
      },
      {
        step: 6,
        action: "Facility Sweep (Kiosk & Restrooms)",
        detail: "Dedicated staff sweep the convenience kiosk, back rooms, and restrooms to ensure no staff or customers are left behind."
      },
      {
        step: 7,
        action: "Managerial Roll Call & Shift Sheet Signatures",
        detail: "The site manager brings out the daily shift sheet to conduct a formal roll call at the assembly point, recording names and signatures of all staff and assembled customers."
      },
      {
        step: 8,
        action: "Statutory Compliance (Twice-Yearly Fire Drills)",
        detail: "Statutory mandate: Verified fire and evacuation drills must be conducted and logged twice a year (bi-annually) across all shifts."
      },
      {
        step: 9,
        action: "Emergency Services Dispatch & Handover",
        detail: "Managers and marshals confirm Emergency Services (10177 / 112) dispatch and maintain site lockdown until formal Fire Chief clearance."
      }
    ]
  },
  spillResponse: {
    title: "Emergency Spill Response Process & Steps (Service Stations)",
    motto: "REMEMBER TO STAY CALM",
    steps: [
      {
        step: 1,
        title: "Immediate Emergency Stop",
        detail: "Hit the emergency stop button immediately to cut fuel dispenser power and stop the source of the spill."
      },
      {
        step: 2,
        title: "Teamwork & PPE (6-to-7-Person Spill Team)",
        detail: "Deploy the coordinated 6-to-7-person spill team wearing full PPE gloves, goggles, and safety boots to contain the spill before it reaches stormwater drains."
      },
      {
        step: 3,
        title: "Absorption & Containment (Sponge/Pads & Cloths)",
        detail: "One team member covers the spill with absorbent sponge/pads to soak up bulk fuel; simultaneously, another covers the fuel with specialized absorbent cloths."
      },
      {
        step: 4,
        title: "Hazardous Waste Disposal (Old-Oil Drums)",
        detail: "Staff wearing PPE gloves pick up the fuel-saturated sponges, pads, and cloths and place them directly into designated old-oil drums / hazardous waste containers."
      },
      {
        step: 5,
        title: "Sand Casting & Broom Sweep",
        detail: "Another team member casts dry forecourt sand over the remaining residue, while another sweeps it thoroughly using a non-sparking broom."
      },
      {
        step: 6,
        title: "Single-Use Spill Kit Replenishment",
        detail: "Spill kit contents (absorbents, pads, cloths, and sand) are strictly single-use only and must be fully restocked immediately after use."
      },
      {
        step: 7,
        title: "Stormwater Drain & Interceptor Verification",
        detail: "Inspect stormwater drain grates and oil/water separator chambers to confirm zero hydrocarbon runoff left the forecourt apron."
      },
      {
        step: 8,
        title: "Supervisor Incident Log & Wetstock Deduction",
        detail: "Record the spill volume in the site OHS incident register and Wetstock Reconciliation ledger, and notify management/authorities if required."
      }
    ]
  }
};
