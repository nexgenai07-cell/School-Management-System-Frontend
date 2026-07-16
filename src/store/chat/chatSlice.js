import { createSlice } from '@reduxjs/toolkit';
import {
  initChat,
  sendMessage,
  disconnectChat,
  loadHistory,
  openSession,
  removeSession,
} from './chatThunks';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessions: [],
    currentSession: null,
    messages: [],
    isCompactOpen: false,
    loading: false,
    error: null,
    activeChild: null,
  },
  reducers: {
    toggleCompact: (state) => {
      state.isCompactOpen = !state.isCompactOpen;
    },
    closeCompact: (state) => {
      state.isCompactOpen = false;
    },
    setActiveChild: (state, action) => {
      state.activeChild = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentSession = null;
      state.messages = [];
    },
    addSessionToList: (state, action) => {
      state.sessions.unshift(action.payload);
    },
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // initChat
      .addCase(initChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(initChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
        state.sessions.unshift(action.payload);
        state.messages = [];
      })
      .addCase(initChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { userMessage, assistantMessage } = action.payload;
        state.messages.push(userMessage, assistantMessage);
        // Auto‑title the session after first user message
        if (state.currentSession && state.messages.length === 2) {
          state.currentSession.title = userMessage.content.slice(0, 40);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // loadHistory
      .addCase(loadHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(loadHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // openSession
      .addCase(openSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(openSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload.session;
        state.messages = action.payload.messages;
      })
      .addCase(openSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // removeSession
      .addCase(removeSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeSession.fulfilled, (state, action) => {
        state.loading = false;
        const sessionId = action.payload;
        state.sessions = state.sessions.filter((s) => s.id !== sessionId);
        if (state.currentSession?.id === sessionId) {
          state.currentSession = null;
          state.messages = [];
        }
      })
      .addCase(removeSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // disconnectChat
      .addCase(disconnectChat.fulfilled, () => {});
  },
});

export const {
  toggleCompact,
  closeCompact,
  setActiveChild,
  clearCurrentChat,
  addSessionToList,
  setCurrentSession,
  setMessages,
} = chatSlice.actions;

export default chatSlice.reducer;