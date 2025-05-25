from utils.DateFormat import DateFormat


class Empleados:
    def __init__(self, id_empleado, nombres, apellidos, dui, correo, telefono, fecha_nacimiento, id_cargo):
        self.id_empleado = id_empleado
        self.nombres = nombres
        self.apellidos = apellidos
        self.correo = correo
        self.telefono = telefono
        self.dui = dui
        
    def to_JSON(self):
        return {
            "id_empleado": self.id_empleado,
            "nombres": self.nombres,
            "apellidos": self.apellidos,
            "correo": self.correo,
            "telefono": self.telefono,
            "dui": self.dui
         }

