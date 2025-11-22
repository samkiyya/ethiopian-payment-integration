const { DataTypes } = require('sequelize');

const defineAddisPayTransaction = (sequelize) =>
  sequelize.define(
    'AddisPayTransaction',
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
        allowNull: false,
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
      tableName: 'addispay_transactions',
      underscored: true
    }
  );

module.exports = defineAddisPayTransaction;
