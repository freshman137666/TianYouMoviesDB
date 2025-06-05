package com.example.mysqltext.util;

import com.example.mysqltext.model.User.AdminType;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(AdminType.class)
public class AdminTypeHandler extends BaseTypeHandler<AdminType> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, AdminType parameter, JdbcType jdbcType)
            throws SQLException {
        ps.setString(i, parameter.getValue());
    }

    @Override
    public AdminType getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return AdminType.fromValue(value);
    }

    @Override
    public AdminType getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return AdminType.fromValue(value);
    }

    @Override
    public AdminType getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return AdminType.fromValue(value);
    }
}