// @ts-nocheck
import dynamic from 'next/dynamic';
export const REG = {
  Home: { d: dynamic(() => import('./HomeD')), m: dynamic(() => import('./HomeM')) },
  Destinations: { d: dynamic(() => import('./DestinationsD')), m: dynamic(() => import('./DestinationsM')) },
  Builder: { d: dynamic(() => import('./BuilderD')), m: dynamic(() => import('./BuilderM')) },
  How: { d: dynamic(() => import('./HowD')), m: dynamic(() => import('./HowM')) },
  Pricing: { d: dynamic(() => import('./PricingD')), m: dynamic(() => import('./PricingM')) },
  Teams: { d: dynamic(() => import('./TeamsD')), m: dynamic(() => import('./TeamsM')) },
  Partners: { d: dynamic(() => import('./PartnersD')), m: dynamic(() => import('./PartnersM')) },
  Resources: { d: dynamic(() => import('./ResourcesD')), m: dynamic(() => import('./ResourcesM')) },
  Portal: { d: dynamic(() => import('./PortalD')), m: dynamic(() => import('./PortalM')) },
  Contact: { d: dynamic(() => import('./ContactD')), m: dynamic(() => import('./ContactM')) },
  Intake: { d: dynamic(() => import('./IntakeD')), m: dynamic(() => import('./IntakeM')) },
  Quick: { d: dynamic(() => import('./QuickD')), m: dynamic(() => import('./QuickM')) },
  Upload: { d: dynamic(() => import('./UploadD')), m: dynamic(() => import('./UploadM')) },
  Arrival: { d: dynamic(() => import('./ArrivalD')), m: dynamic(() => import('./ArrivalM')) },
  TeamDemo: { d: dynamic(() => import('./TeamDemoD')), m: dynamic(() => import('./TeamDemoM')) },
  PartnerApp: { d: dynamic(() => import('./PartnerAppD')), m: dynamic(() => import('./PartnerAppM')) },
  Privacy: { d: dynamic(() => import('./PrivacyD')), m: dynamic(() => import('./PrivacyM')) },
  Terms: { d: dynamic(() => import('./TermsD')), m: dynamic(() => import('./TermsM')) },
};
