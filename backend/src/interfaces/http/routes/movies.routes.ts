import { Router } from "express";
import { TMDBAdapter } from "../../../infrastructure/adapter/TMDBAdapter.ts";
import { GetMovies } from "../../../application/use-cases/GetMovies.ts";
import { MovieController } from "../controllers/MovieController.ts";
import { SqlFileWriter } from "../../../infrastructure/utils/SqlFileWriter.ts";

const router = Router()

const repository = new TMDBAdapter()
const useCase = new GetMovies(repository)
const controller = new MovieController(useCase, new SqlFileWriter()) // <--- Pasar instancia de SqlFileWriter al controlador

router.get("/", controller.getAll.bind(controller))
router.get("/popular", controller.getPopular.bind(controller))
router.get("/top-rated", controller.getTopRated.bind(controller))
router.get("/upcoming", controller.getUpcoming.bind(controller))
router.get("/now-playing", controller.getNowPlaying.bind(controller))
router.get("/search/:name", controller.getByName.bind(controller))
router.get("/:id", controller.getById.bind(controller))
// Añadir antes de la ruta /:id (para evitar conflictos)
router.get("/:id/trailer", controller.getTrailer.bind(controller));

export default router