exports.success = (
  res,
  message = "success",
  data = null,
  meta = {},
  status = 200
) => {
  const payload = { success: true, message, data };
  if (meta && Object.keys(meta).length) payload.meta = meta;
  return res.status(status).json(payload);
};