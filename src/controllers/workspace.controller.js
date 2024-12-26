import Workspace from '../models/workspace.model.js';
import Channel from '../models/channel.model.js';
import { User } from '../models/user.model.js';
import errorCodes from '../errors/errors.js';

// Ver todos los Workspaces a los que estoy unido
export const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaces = await Workspace.find(
      { members: userId },
      'name image'
    ).populate([
      {
        path: 'owner',
        select: '_id'
      },
      {
        path: 'channels',
        select: '_id name'
      }
    ]);
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los workspaces', error });
  }
};

// Buscar workspaces
export const searchWorkspaces = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || name.length < 2) {
      return res.status(200).json([]);
    }
    let workspaces = await Workspace.find(
      {
        name: { $regex: name, $options: 'i' } // 'i' para insensibilidad a mayúsculas
      },
      'name image members'
    );

    workspaces = workspaces.filter((w) => {
      const found = w.members.find(
        (m) => m.toString() === req.user.id.toString()
      );
      if (found) {
        return false;
      }
      return true;
    });

    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los workspaces', error });
  }
};

// Unirse a un workspace
export const joinWorkspace = async (req, res) => {
  try {
    const { _id } = req.params;
    const workspace = await Workspace.findById(_id).populate('channels');
    const user = await User.findById(req.user.id);

    if (!workspace) {
      return res.status(404).json({
        message: 'Workspace no encontrado',
        code: errorCodes.WORKSPACE_NOT_FOUND
      });
    }

    // Chequeamos si el user es actualmente miembro del workspace para no unirlo nuevamente
    const userInWorkspace = workspace.members.filter(
      (m) => m.toString() === user._id.toString()
    );
    if (userInWorkspace.length > 0) {
      return res.status(400).json({
        message: 'Ya eres miembro de este workspace',
        code: errorCodes.ALREADY_WORKSPACE_MEMBER
      });
    }

    // Agregamos el user al workspace como miembro
    workspace.members.push(req.user.id);
    await workspace.save();

    // Agregamos al user como miembro del channel general del workspace
    const generalChannelId = workspace.channels.find(
      (c) => c.name === 'general'
    );
    const generalChannel = await Channel.findById(generalChannelId);
    generalChannel.members.push(req.user.id);
    await generalChannel.save();

    res.status(200).json({
      _id: workspace._id,
      name: workspace.name,
      image: workspace.image
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los workspaces', error });
  }
};

// Crear un Workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name, image, channelName } = req.body;

    // Se crea nuevo workspace
    const newWorkspace = new Workspace({
      name,
      image: image ? image : undefined,
      members: [req.user.id], // Incluye al creador como miembro inicial
      owner: req.user.id
    });

    const relatedChannels = [];

    // Se crea channel por defecto
    const newChannelDefault = new Channel({
      name: 'general',
      workspace: newWorkspace._id,
      members: [req.user.id],
      owner: req.user.id
    });
    relatedChannels.push(newChannelDefault);
    // Se asocia channel a workspace
    newWorkspace.channels.push(newChannelDefault._id);

    // Si se desea agregar un channel ademas del default lo creamos
    if (channelName.toLowerCase() !== 'general') {
      const newChannel = new Channel({
        name: channelName.toLowerCase(),
        workspace: newWorkspace._id,
        members: [req.user.id],
        owner: req.user.id
      });
      relatedChannels.push(newChannel);
      // Se asocia channel a workspace
      newWorkspace.channels.push(newChannel._id);
    }

    // Grabar los channels creados
    Channel.insertMany(relatedChannels);

    // Se guarda el nuevo workspace con el/los channel/s creado/s
    await newWorkspace.save();

    res.status(201).json({ _id: newWorkspace._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el workspace', error });
  }
};

// Buscar un Workspace específico
export const getWorkspaceById = async (req, res) => {
  try {
    // Solamente se puede acceder al detalle de un workspace si se es miembro del mismo
    const workspace = await Workspace.findOne(
      {
        _id: req.params._id,
        members: req.user.id
      },
      'name channels'
    ).populate([
      {
        path: 'channels',
        select: 'name owner members messages'
      }
    ]);

    // Buscamos los canales de los cuales el usuario logueado es miembro
    const joinedChannels = workspace.channels.filter((c) => {
      const foundMember = c.members.find(
        (m) => m._id.toString() === req.user.id.toString()
      );
      if (foundMember) {
        return true;
      }
      return false;
    });

    workspace.channels = joinedChannels;

    if (!workspace)
      return res.status(404).json({
        message: 'Workspace no encontrado o no sos miembro del mismo'
      });
    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el workspace', error });
  }
};

// Actualizar un Workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, image } = req.body;
    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      _id,
      {
        name,
        image
      },
      { new: true }
    );
    if (!updatedWorkspace)
      return res.status(404).json({ message: 'Workspace no encontrado' });
    res.status(200).json({
      _id: updatedWorkspace._id,
      name: updatedWorkspace.name,
      image: updatedWorkspace.image
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el workspace', error });
  }
};

// Eliminar un Workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedWorkspace = await Workspace.findByIdAndDelete(_id);

    if (!deletedWorkspace)
      return res.status(404).json({ message: 'Workspace no encontrado' });

    // Eliminar channels asociados al workspace
    await Channel.deleteMany({
      _id: { $in: deletedWorkspace.channels.map((c) => c._id) }
    });

    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al eliminar el workspace', error });
  }
};
