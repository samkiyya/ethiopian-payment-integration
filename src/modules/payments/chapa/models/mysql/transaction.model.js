const { DataTypes } = require('sequelize');

const defineChapaTransaction = (sequelize) =>
  sequelize.define(
    'ChapaTransaction',
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
      checkoutUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true
      }
    },
    {
      tableName: 'chapa_transactions',
      underscored: true
    }
  );

module.exports = defineChapaTransaction;
