import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	activeTab : 'chat',
	userSidebar : false,
	conversationName : 'Doris Brown',
	layoutMode : 'light'
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setActiveTab(state, { payload }) {
      state.activeTab = payload;
    },
    openUserSidebar(state) {
      state.userSidebar = true;
    },
    closeUserSidebar(state) {
      state.userSidebar = false;
    },
    setconversationNameInOpenChat(state, { payload }) {
      state.conversationName = payload;
    },
    changeLayoutMode(state, { payload }) {
      state.layoutMode = payload;
    },
  },
});

export const { 
  setActiveTab,
  openUserSidebar,
  closeUserSidebar,
  setconversationNameInOpenChat,
  changeLayoutMode,
} = layoutSlice.actions;
export default layoutSlice.reducer;