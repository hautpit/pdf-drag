export interface NotificationModel {
  id: number;
  createdTime: Date;
  type: string;
  content: string;
  isRead: boolean;
  email: string;
  lastModified: Date;
  from: string;
  url: string;
  isSeen: boolean;
}
