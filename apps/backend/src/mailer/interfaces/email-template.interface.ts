export interface EmailTemplateData {
  [key: string]: any;
}

export interface EmailTemplate<T extends EmailTemplateData = EmailTemplateData> {
  generate(data: T): string;
}
