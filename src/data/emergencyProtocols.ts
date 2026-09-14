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
        action: "Hit Emergency Stop & Alert Cashiers",
        detail: "Notify the person nearest to the emergency stop button and notify the cashiers who in turn will ensure that everybody is inside the building to be counted for."
      },
      {
        step: 2,
        action: "Panic Prevention",
        detail: "Managers/marshals to ensure there is no panic."
      },
      {
        step: 3,
        action: "Lead to Assembly Point",
        detail: "Managers to ensure everyone, including customers who are inside the building, must follow them to the relevant assembly point."
      },
      {
        step: 4,
        action: "Roll Call Verification",
        detail: "Managers must remember to carry their shift sheet for that particular day to use as a roll call list and update accordingly."
      },
      {
        step: 5,
        action: "Trained First-Response Fire Fighting",
        detail: "All staff that are trained and feel comfortable to do so, should retrieve the fire extinguisher and put out the fire, as per training received."
      },
      {
        step: 6,
        action: "Traffic Control & Site Perimeter Lockdown",
        detail: "2 x staff members to block off the entrance and exits of the site (Control Traffic)."
      },
      {
        step: 7,
        action: "Forecourt Engine Shut-Off & Evacuation",
        detail: "Other forecourt staff must advise customers to switch off their engines, then to follow them to the relevant assembly point."
      },
      {
        step: 8,
        action: "Restroom & Kiosk Sweeps",
        detail: "Forecourt staff must also ensure that all the restrooms and kiosk are checked for staff or customers (we need to account for everyone that is on shift for that day, including customers)."
      },
      {
        step: 9,
        action: "Emergency Services Dispatch",
        detail: "Managers and Marshals must ensure that they have all emergency contact numbers."
      }
    ]
  },
  spillResponse: {
    title: "Emergency Spill Response Process & Steps (Service Stations)",
    motto: "REMEMBER TO STAY CALM",
    steps: [
      {
        step: 1,
        title: "Risk Assessment",
        detail: "Assess the situation, identify the source, volume, and fire danger."
      },
      {
        step: 2,
        title: "Protective Clothing",
        detail: "Put on protective clothing provided in the spill kit (gloves, goggles, boots)."
      },
      {
        step: 3,
        title: "Limit the Spill",
        detail: "Plug the hole, shut the valve off, or hit emergency stop dispenser valves."
      },
      {
        step: 4,
        title: "Containment",
        detail: "Use brooms, containment socks, and absorbents to contain the spillage and block drains."
      },
      {
        step: 5,
        title: "Begin Clean-Up",
        detail: "Use loose absorbent peat/granules from the spill kit to clean up the pool."
      },
      {
        step: 6,
        title: "Contact Authorities",
        detail: "Contact superiors or managers, and notify emergency authorities if necessary."
      },
      {
        step: 7,
        title: "Dispose of Used Material",
        detail: "Dispose of used, contaminated absorbents in designated hazardous waste bags as per statutory regulations."
      },
      {
        step: 8,
        title: "Restock Materials",
        detail: "Immediately replace and restock any spill kit materials used."
      }
    ]
  }
};
