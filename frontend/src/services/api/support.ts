import { axios } from '@/lib/axios';

export interface CSATRatingData {
  rating: number;
  feedback?: string;
  ticket?: string;
  chat_interaction?: string;
}

export interface ChatMessageData {
  message: string;
  session_id?: string;
}

export interface ProblemReportData {
  session_id: string;
  transcript_snippet?: string;
  console_log?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  intent: {
    id: number;
    name: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntercomConversation {
  id: string;
  open: boolean;
  messages: Array<{
    text: string;
    timestamp: string;
    type: string;
  }>;
}

export interface IntercomEvent {
  type: string;
  conversation?: IntercomConversation;
}

const supportService = {
  sendChatMessage: (data: ChatMessageData) => {
    return axios.post<{
      session_id: string;
      response: string;
      intent_detected: string | null;
      confidence: number;
      escalated: boolean;
      ticket_id: string | null;
    }>('/api/support/chat', data);
  },

  submitCsatRating: (data: CSATRatingData) => {
    return axios.post<{ success: boolean }>('/api/support/csat', data);
  },

  reportProblem: (data: ProblemReportData) => {
    return axios.post<{ ticket_id: string }>('/api/support/report-problem', data);
  },

  getFaqs: (category?: string) => {
    return axios.get<FAQ[]>('/api/support/faqs', {
      params: category ? { category } : undefined
    });
  }
};

export default supportService;