import Workspace from '../models/workspace.model.js';

export async function validateWorkspaceOwnership(req, res, next) {
  console.log(req.params);
  const foundWorkspace = await Workspace.findOne({
    _id: req.params._id ? req.params._id : req.params.workspaceId,
    owner: req.user.id
  });
  if (!foundWorkspace) {
    return res
      .status(404)
      .json({ message: 'Workspace no encontrado o no es el owner' });
  }
  next();
}

export async function validateWorkspaceMembership(req, res, next) {
  const foundWorkspace = await Workspace.findOne({
    _id: req.params._id ? req.params._id : req.params.workspaceId,
    members: { $in: req.user.id }
  });
  if (!foundWorkspace) {
    return res
      .status(404)
      .json({ message: 'Workspace no encontrado o no es miembro' });
  }
  next();
}
