import { body, validationResult, query } from "express-validator";

// Middleware genérico para manejar errores de validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validaciones para reutilizar
const emailValidation = body("email")
  .isEmail()
  .withMessage("El email no es válido");

const usernameValidation = body("username")
  .isLength({ min: 5 })
  .withMessage("El nombre de usuario debe tener al menos 5 caracteres");

const passwordValidation = body("password")
  .isLength({ min: 8 })
  .withMessage("La contraseña debe tener al menos 8 caracteres");

const imageValidator = body("image")
  .optional()
  .custom((value) => {
    const regexBase64 = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    const regexUrl = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i;
    if (!regexBase64.test(value) && !regexUrl.test(value)) {
      throw new Error(
        "La imagen debe ser una imagen en base64 o una URL válida."
      );
    }
    return true;
  });

const channelNameValidation = body("channelName")
  .isLength({ min: 3, max: 50 })
  .withMessage("El nombre del Canal debe tener entre 3 y 50 caracteres");

// Validaciones
export const validateLogin = [emailValidation, passwordValidation, validate];

export const validateRegister = [
  usernameValidation,
  emailValidation,
  passwordValidation,
  imageValidator,
  validate,
];

export const validateEmailForPasswordReset = [emailValidation, validate];

export const validateResetPassword = [passwordValidation, validate];

// Validación para Workspace
export const validateWorkspace = [
  body("name")
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre del Workspace debe tener entre 3 y 50 caracteres"),
  imageValidator,
  channelNameValidation,
  validate,
];

export const validateWorkspaceUpdate = [
  body("name")
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre del Workspace debe tener entre 3 y 50 caracteres"),
  imageValidator,
  validate,
];

// Validación para busqueda de Workspaces
export const validateWorkspaceSearch = [
  query("name")
    .isLength({ min: 3, max: 50 })
    .withMessage("Debe proporcionar un name para buscar workspaces"),
  validate,
];

// Validación para Channel
export const validateChannel = [channelNameValidation, validate];

// Validación para Message
export const validateMessage = [
  body("content")
    .isLength({ min: 1, max: 1000 })
    .withMessage("El mensaje debe tener entre 1 y 1000 caracteres"),
  validate,
];
