export const getMessageInfo = (status: number | string): string => {
  let msg = "";
  switch (status) {
    case 400:
      msg = "请求错误(400)";
      break;
    case 401:
      msg = "请求错误(401)";
      break;
    case 403:
      msg = "请求错误(403)";
      break;
    case 500:
      msg = "请求错误(500)";
      break;
    case 503:
      msg = "请求错误(503)";
      break;

    default:
      msg = `连接出错(${status})!`;
      break;
  }
  return msg;
};
