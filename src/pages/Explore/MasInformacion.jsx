import { useParams, useNavigate } from "react-router-dom"; // 👈 importar useNavigate
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useEffect, useState } from "react";

const MasInformacion = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // 👈 inicializar useNavigate
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const ref = doc(db, "projects", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProject({ id: snap.id, ...snap.data() });
        } else {
          console.warn("⚠️ Proyecto no encontrado.");
        }
      } catch (error) {
        console.error("❌ Error al obtener el proyecto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const goBack = () => {
    navigate("/todoslosproyectos");
  };

  if (loading) return <p className="text-center mt-4">Cargando proyecto...</p>;
  if (!project) return <p className="text-center mt-4 text-red-600">Proyecto no encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">Detalles del Proyecto</h1>
      <div className="bg-white border rounded-xl shadow p-4 space-y-2">
        <p><strong>Título:</strong> {project.title}</p>
        <p><strong>Descripción:</strong> {project.description || "No disponible"}</p>
        <p><strong>Autor:</strong> {project.authorName || "Anónimo"}</p>
        <p><strong>Fecha de creación:</strong> {project.createdAt?.toDate?.().toLocaleString?.() || "No disponible"}</p>
      </div>

      <button
        onClick={goBack}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Volver a Todos los Proyectos
      </button>
    </div>
  );
};

export default MasInformacion;
