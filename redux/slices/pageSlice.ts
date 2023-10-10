import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";
import ApiClient from "../../configs/axiosConfig";

export const fetchListPage = createAsyncThunk(
  'fetchListPage', 
  async (thunkAPI) => {
    const session = await getSession() as any
    const url = "https://graph.facebook.com/me/accounts"
    const param = {
      fields: 'name,picture,tasks,access_token',
      access_token: session?.access_token
    }
    const response = await ApiClient.GET(url, param);
    return response
  }
)

export interface PageState {
  pageSelected: any;
  listPageActived: any[];
  listPageInactived: any[];
}

const initialState: PageState = {
  pageSelected: {
    name: "",
    id: "",
    picture: {
      data: {
        height: 0,
        is_silhouette: false,
        url: "",
        width: 0
      }
    },
    tasks: [],
    access_token: ""
  },
  listPageActived: [],
  listPageInactived: []
}

export const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    setListPageInactived: (state, payload: PayloadAction<{data: any}>) => {

    },
    selectPage: (state, action: PayloadAction<any>) => {
      return { ...state, pageSelected: action.payload }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListPage.fulfilled, (state, { payload }) => {
      state.listPageInactived = (payload as any).data
    })
  },
})

export const { selectPage } = pageSlice.actions;
export default pageSlice.reducer;