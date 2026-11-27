import React from 'react';
import { Utensils, Smile, Video, GraduationCap } from 'lucide-react';
import { Language } from '../../data/translations';
import { ShopFoodServiceR638 } from '../ShopFoodServiceR638';
import { CustomerServiceModule } from '../CustomerServiceModule';
import { VideoTrainingAcademy } from '../training/VideoTrainingAcademy';
import { StatutoryTrainingModule } from '../StatutoryTrainingModule';
import { MonthlyRefresherHub } from '../MonthlyRefresherHub';
import { StatutoryRightsModule } from '../StatutoryRightsModule';
import { DemoVideoTab } from '../DemoVideoTab';
import { getActiveTenant } from '../../multiTenantConfig';

export type ShopTrainingSubTab =
  | 'r638Haccp'
  | 'customerService'
  | 'videoAcademy'
  | 'statutoryHub';

interface ShopTrainingWorkspaceProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeSubTab: ShopTrainingSubTab;
  onSubTabChange: (sub: ShopTrainingSubTab) => void;
  onNavigateTarget: (target: string) => void;
  onOpenCertModal: () => void;
  onOpenStatutoryModal: () => void;
  onOpenDossier: () => void;
  autoStartExecutiveTour?: boolean;
  onExecutiveTourConsumed?: () => void;
}

export const ShopTrainingWorkspace: React.FC<ShopTrainingWorkspaceProps> = ({
  lang,
  onLanguageChange,
  activeSubTab,
  onSubTabChange,
  onNavigateTarget,
  onOpenCertModal,
  onOpenStatutoryModal,
  onOpenDossier,
  autoStartExecutiveTour,
  onExecutiveTourConsumed,
}) => {
  const tenant = getActiveTenant();

  return (
    <div className="space-y-6" data-testid="pillar-workspace-shop-training">
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'r638Haccp' as const, label: 'R638 Shop & Food HACCP', icon: Utensils },
            { id: 'customerService' as const, label: '7-Step Forecourt Service & Store', icon: Smile },
            { id: 'videoAcademy' as const, label: 'Video Training Academy & Quiz', icon: Video },
            { id: 'statutoryHub' as const, label: 'Training Packs, Refresher & Rights', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`shop-subtab-${tab.id}`}
                onClick={() => onSubTabChange(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                  activeSubTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <span className="text-xs font-mono text-emerald-300 px-3">
          Pillar 3 • Shop, Food Service &amp; Training ({tenant.siteCode})
        </span>
      </div>

      {activeSubTab === 'r638Haccp' && <ShopFoodServiceR638 />}
      {activeSubTab === 'customerService' && <CustomerServiceModule />}
      {activeSubTab === 'videoAcademy' && (
        <VideoTrainingAcademy
          lang={lang}
          onLanguageChange={onLanguageChange}
          autoStartExecutiveTour={autoStartExecutiveTour}
          onExecutiveTourConsumed={onExecutiveTourConsumed}
        />
      )}
      {activeSubTab === 'statutoryHub' && (
        <div className="space-y-8">
          <StatutoryTrainingModule
            lang={lang}
            onNavigateTab={onNavigateTarget}
            onOpenCertModal={onOpenCertModal}
            onOpenStatutoryModal={onOpenStatutoryModal}
          />
          <MonthlyRefresherHub lang={lang} onOpenDossier={onOpenDossier} />
          <StatutoryRightsModule />
          <DemoVideoTab
            lang={lang}
            onNavigateTab={(t) => onNavigateTarget(t)}
            onOpenCertModal={onOpenCertModal}
          />
        </div>
      )}
    </div>
  );
};

