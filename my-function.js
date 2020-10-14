exports.handler = async (event) => {
  // TODO implement

  const param = event["queryStringParameters"]["keyword"];
  const response = {
    statusCode: 200,
    body: JSON.stringify("Koushik says " + param),
  };
  return response;
};
