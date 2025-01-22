export type InstSetting = {
  token: string;
  userId: string;
  sessionId: string;
};

export type RespAxiosInstAcc = {
  users: {
    user: InstUser;
    position: number;
  }[];
  status: string;
  has_more: boolean;
};

export type InstUser = {
  id: string;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
};
