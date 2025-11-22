const { DataTypes } = require('sequelize');

const defineSantiPayTransaction = (sequelize) =>
  sequelize.define(
    'SantiPayTransaction',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING(5),
        defaultValue: 'ETB'
      },
      status: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        defaultValue: 'pending'
      },
      providerReference: {
        type: DataTypes.STRING,
        allowNull: false
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true
      }
    },
    {
      tableName: 'santipay_transactions',
      underscored: true
    }
  );

module.exports = defineSantiPayTransaction;
