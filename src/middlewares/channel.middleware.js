import Channel from '../models/channel.model.js';

export async function validateChannelOwnership(req, res, next) {
  console.log({
    _id: req.params._id ? req.params._id : req.params.channelId,
    owner: req.user.id
  });
  const foundChannel = await Channel.findOne({
    _id: req.params._id ? req.params._id : req.params.channelId,
    owner: req.user.id
  });
  if (!foundChannel) {
    return res
      .status(404)
      .json({ message: 'Channel no encontrado o no es el dueño' });
  }
  next();
}

export async function validateChannelMembership(req, res, next) {
  const foundChannel = await Channel.findOne({
    _id: req.params._id ? req.params._id : req.params.channelId,
    members: { $in: req.user.id }
  });
  if (!foundChannel) {
    return res
      .status(404)
      .json({ message: 'Channel no encontrado o no formas parte del mismo' });
  }
  next();
}
