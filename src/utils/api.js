import instance from "./request";

// 提交
export const SubmitEIInfo = (params) => {
  return instance({
    url: "/PDAServer/BossWebApi/SubmitEIInfo",
    method: "post",
    params: params
  })
}