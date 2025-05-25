import { useState, useEffect } from "react";
import { fetchClient } from "../../services/fetchClient";
import { Producto } from "../../interfaces/IProductos";
import { Categoria } from "../../interfaces/ICategorias";
import { Button } from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DataTable } from "./DataTable";
import { ProductoModal } from "./ProductoModal";
import Swal from "sweetalert2";

export function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | undefined>(undefined);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setProductoSeleccionado(undefined);
  };

  const obtenerProductos = async () => {
    try {
      const data = await fetchClient<Producto[]>("/api/productos");
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const data = await fetchClient<Categoria[]>("/api/categorias");
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  const handleNuevo = () => {
    setProductoSeleccionado(undefined);
    setModalOpen(true);
  };

  const handleEditar = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const handleEliminar = async (producto: Producto) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el producto "${producto.nombre_producto}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetchClient(`/api/productos/delete/${producto.id_productos}`, {
          method: "DELETE",
        });

        setProductos((prev) =>
          prev.filter((p) => p.id_productos !== producto.id_productos)
        );

        Swal.fire("Eliminado", "El producto fue eliminado correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message || "No se pudo eliminar el producto", "error");
      }
    }
  };

  const getCategoriaNombre = (idCategoria: number) => {
    const categoria = categorias.find((c) => c.id_categoria === idCategoria);
    return categoria ? categoria.nombre_categoria : "Categoría no encontrada";
  };

  const renderDisponible = (disponible: string) => {
    return disponible === "true" ? "Sí" : "No";
  };

  return (
    <div>
      <h2 className="mt-4">Lista de Productos</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button color="primary" onClick={handleNuevo}>
          Nuevo Producto
        </Button>
      </div>

      <DataTable<Producto>
        data={productos}
        columns={[
          {
            key: "id_categoria",
            label: "Categoría",
            render: (item) => getCategoriaNombre(item.id_categoria),
          },
          { key: "nombre_producto", label: "Nombre Producto" },
          { key: "descripcion", label: "Descripción" },
          { key: "precio", label: "Precio" },
          {
            key: "disponible",
            label: "Disponible",
            render: (item) => renderDisponible(item.disponible),
          },
          {
            key: "acciones",
            label: "Acciones",
            render: (producto: Producto) => (
              <div className="d-flex justify-content-center gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleEditar(producto)}
                >
                  <FaEdit />
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleEliminar(producto)}
                >
                  <FaTrashAlt />
                </Button>
              </div>
            ),
          },
        ]}
        searchKeys={["nombre_producto", "descripcion"]}
      />

      <ProductoModal
        isOpen={modalOpen}
        toggle={toggleModal}
        producto={productoSeleccionado}
        categorias={categorias}
        onSuccess={obtenerProductos}
      />
    </div>
  );
}
