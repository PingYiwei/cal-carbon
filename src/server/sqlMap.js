export const sqlMap = {
    carbon_data: {
        primary_category: "select * from primary_category",
        material_list: "select * from materials",
        update_data: "insert into materials (mid, m_mass, m_factor, m_distance) values ? as new on duplicate key update " +
            "m_mass=new.m_mass, m_factor=new.m_factor, m_distance = new.m_distance",
    }
}