import {emailTemplates} from "../assets/data/emailTemplates";
import {EmailTemplateData} from "../interfaces/EmailNotifications";
import Handlebars from "handlebars";

export const getEmailTemplate =(templateId: string): EmailTemplateData | undefined => {
  return emailTemplates.find((item) => item.templateId === templateId);
};

export const getEmailTemplateData = (
  templateId: string,
  data: Record<string, string>
): EmailTemplateData | undefined => {
  const template = emailTemplates.find((item) => item.templateId === templateId);

  if (template) {
    const compiledHtml = Handlebars.compile(template.html);
    const compiledText = Handlebars.compile(template.text);

    const replacedHtml = compiledHtml(data);
    const replacedText = compiledText(data);

    return {
      ...template,
      html: replacedHtml,
      text: replacedText,
    };
  }

  return undefined;
};
