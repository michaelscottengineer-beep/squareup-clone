import type { RouteObject } from "react-router";
import BrevoLayout from "@/pages/brevo/BrevoLayout";
import ContactPage from "@/pages/brevo/contact/ContactPage";
import ListPage from "@/pages/brevo/list/ListPage";
import ListDetails from "@/pages/brevo/list/ListDetails";
import CampaignLayout from "@/pages/brevo/marketing/campaign/CampaignLayout";
import CreationSmsCampaignPage from "@/pages/brevo/marketing/campaign/CreationSmsCampaignPage";
import SmsCampaignEditionPage from "@/pages/brevo/marketing/campaign/SmsCampaign/SmsCampaignEditionPage";
import SmsCampaignDesignMessagePage from "@/pages/brevo/marketing/campaign/SmsCampaign/SmsCampaignDesignMessagePage";
import EmailCampaignCreationPage from "@/pages/brevo/marketing/campaign/EmailCampaign/EmailCampaignCreationPage";
import EmailCampaignEditorPage from "@/pages/brevo/marketing/campaign/EmailCampaign/EmailCampaignEditorPage";
import MailTemplateLayout from "@/pages/brevo/marketing/MailTemplate/MailTemplateLayout";
import MailTemplateCreationPage from "@/pages/brevo/marketing/MailTemplate/MailTemplateCreationPage";
import MailTemplate1 from "@/components/MaketingCampaign/MailTemplates/MailTemplate1";
import MailTemplateEdit from "@/pages/brevo/marketing/MailTemplate/MailTemplateEdit";
import MailTemplateDesignPage from "@/pages/brevo/marketing/MailTemplate/MailTemplateDesignPage";
import MailTemplate2 from "@/components/MaketingCampaign/MailTemplates/Template2/MailTemplate2";

const brevoRoute: RouteObject = {
  path: "/brevo",
  element: <BrevoLayout />,
  children: [
    {
      path: "/brevo/contact",
      element: <ContactPage />,
    },
    {
      path: "/brevo/list",
      element: <ListPage />,
    },
    {
      path: "/brevo/list/:listId",
      element: <ListDetails />,
    },
    {
      path: "/brevo/campaign",
      element: <CampaignLayout />,
    },
    {
      path: "/brevo/mail-templates",
      element: <MailTemplateLayout />,
    },
    {
      path: "/brevo/mail-templates/new",
      element: <MailTemplateCreationPage />,
    },
    {
      path: "/brevo/mail-templates/:mailTemplateId",
      element: <MailTemplateEdit />,
    },
    {
      path: "/brevo/mail-templates/:mailTemplateId/design",
      element: <MailTemplateDesignPage />,
    },
    {
      path: "/brevo/mail-templates/m1",
      element: <MailTemplate1 />,
    },
    {
      path: "/brevo/mail-templates/m2",
      element: <MailTemplate2 />,
    },
    {
      path: "/brevo/email-campaign/campaign-setup",
      element: <EmailCampaignCreationPage />,
    },
    {
      path: "/brevo/email-campaign/edit/:campaignId",
      element: <EmailCampaignEditorPage />,
    },
    {
      path: "/brevo/sms-campaign/campaign-setup",
      element: <CreationSmsCampaignPage />,
    },
    {
      path: "/brevo/sms-campaign/edit/:campaignId",
      element: <SmsCampaignEditionPage />,
    },
    {
      path: "/brevo/sms-campaign/design/:campaignId",
      element: <SmsCampaignDesignMessagePage />,
    },
  ],
};

export default brevoRoute;
