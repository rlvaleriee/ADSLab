import { useState, useEffect } from "react";
import React from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Container } from "reactstrap";

// Interfaces y tipo genérico
interface DataTableProps<T> {
  data: T[];
  columns: {
  key: keyof T | string; // permite columnas extra como "acciones"
  label: string;
  render?: (item: T) => React.ReactNode;
  }[];
  searchKeys: (keyof T)[];
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  onEditar?: (item: T) => void;
  onEliminar?: (id: number | string) => void;
  onNuevo?: () => void; // Agregado el prop para el nuevo item
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKeys,
  itemsPerPageOptions = [5, 10, 20],
  defaultItemsPerPage = 10,
  onEditar,
  onEliminar,
  onNuevo,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para los modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "delete" | "new" | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  
  // Filtrado de datos
  const filteredData = data.filter((item) =>
    searchKeys.some((key) =>
      String(item[key]).toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
  );

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const openEditModal = (item: T) => {
    setSelectedItem(item);
    setModalType("edit");
    setModalOpen(true);
  };

  const openDeleteModal = (item: T) => {
    setSelectedItem(item);
    setModalType("delete");
    setModalOpen(true);
  };

  const openNewModal = () => {
    setModalType("new");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setModalType(null);
  };

  return (
    <Container className="mt-4">
      <div>
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex gap-2 w-100">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-75"
            />

            {/* Botón para agregar nuevo */}
            {onNuevo && (
              <Button
                color="success"
                className="btn-sm"
                onClick={openNewModal} 
              >
                <i className="bi bi-plus-circle me-2" />
                Nuevo
              </Button>
            )}
          </div>
        </div>

        {/* barra de desplazamiento */}
        <div
          className="table-responsive"
          style={{
            maxHeight: "400px", // Ajusta el tamaño máximo para que no se expanda
            overflowY: "auto", // Aplica la barra de desplazamiento vertical si es necesario
            maxWidth: "100%", // Limita el ancho de la tabla al 100% del contenedor padre
            overflowX: "auto", // Aplica la barra de desplazamiento horizontal si el contenido excede el ancho
          }}
        >
          <Table
            size="s" // 👈 tabla compacta
            hover
            responsive
            className="align-middle text-center mb-1"
          >
            <thead className="table-light">
              <tr>
                {columns.map(({ key, label }) => (
                  <th key={String(key)} className="fw-semibold text-uppercase small">
                    {label}
                  </th>
                ))}
                {(onEditar || onEliminar) && (
                  <th className="fw-semibold text-uppercase small">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {pageData.map((item, index) => (
                <tr key={index}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} style={{ whiteSpace: "nowrap" }}>
                      {col.render ? col.render(item) : String(item[col.key])}
                    </td>
                  ))}
                  {(onEditar || onEliminar) && (
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {onEditar && (
                          <Button
                            size="sm"
                            color="primary"
                            onClick={() => openEditModal(item)}
                          >
                            <i className="bi bi-pencil-square me-1" />
                          </Button>
                        )}
                        {onEliminar && (
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => openDeleteModal(item)}
                          >
                            <i className="bi bi-trash me-1" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <label>Items por página:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="ms-2 form-select form-select-sm d-inline-block"
              style={{ width: "auto" }}
            >
              {itemsPerPageOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-sm btn-outline-primary me-2"
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-outline-primary ms-2"
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Modales */}
        {/* Modal para Editar */}
        <Modal isOpen={modalOpen} toggle={closeModal}>
          <ModalHeader toggle={closeModal}>
            {modalType === "edit" ? "Editar Item" : modalType === "delete" ? "Eliminar Item" : "Nuevo Item"}
          </ModalHeader>
          <ModalBody>
            {/* Dependiendo del tipo de modal, mostraremos diferentes formularios */}
            {modalType === "edit" && selectedItem && (
              <FormGroup>
                <Input
                  type="text"
                  value={String(selectedItem)}
                  readOnly
                />
              </FormGroup>
            )}
            {modalType === "delete" && selectedItem && (
              <div>¿Estás seguro de eliminar este ítem?</div>
            )}
            {modalType === "new" && (
              <FormGroup>
                <Input
                  type="text"
                  placeholder="Nuevo Item"
                />
              </FormGroup>
            )}
          </ModalBody>
          <ModalFooter>
            {modalType === "delete" && (
              <Button color="danger" onClick={() => onEliminar && onEliminar(String(selectedItem?.['id']))}>
                Eliminar
              </Button>
            )}
            <Button color="secondary" onClick={closeModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Container>
  );
}
