import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { InventoryItem, InventoryBatch } from '../../types/clinical';
import {
  Package,
  AlertTriangle,
  Clock,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  Search,
  FileText,
  Boxes,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';

export const InventoryFefoView: React.FC = () => {
  const {
    inventoryItems,
    inventoryBatches,
    inventoryMovements,
    recordInventoryMovement,
    addInventoryItem,
    currentDate,
  } = useClinical();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string>(inventoryItems[0]?.id || '');
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'kardex'>('catalog');

  // Movement Modal Form
  const [moveType, setMoveType] = useState<'entrada' | 'salida_consulta' | 'merma'>('salida_consulta');
  const [moveQuantity, setMoveQuantity] = useState(1);
  const [moveReason, setMoveReason] = useState('Aplicación en consulta médica');
  const [moveError, setMoveError] = useState<string | null>(null);

  // New Item Modal Form
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<'medicamento' | 'insumo' | 'anestesia' | 'descartable'>('medicamento');
  const [itemMinStock, setItemMinStock] = useState(10);
  const [itemUnit, setItemUnit] = useState('piezas');
  const [itemLocation, setItemLocation] = useState('Farmacia General');
  const [itemRequiresRx, setItemRequiresRx] = useState(false);
  const [initBatchNumber, setInitBatchNumber] = useState('');
  const [initExpiration, setInitExpiration] = useState('2027-12-31');
  const [initQuantity, setInitQuantity] = useState(20);
  const [initCost, setInitCost] = useState(50);

  const selectedItem = inventoryItems.find((i) => i.id === selectedItemId) || inventoryItems[0];

  const itemBatches = inventoryBatches
    .filter((b) => b.itemId === selectedItem?.id)
    .sort((a, b) => a.expirationDate.localeCompare(b.expirationDate)); // Earliest expiry first (FEFO)

  const filteredItems = inventoryItems.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q) || i.category.includes(q);
  });

  // Calculate Metrics relative to active operational date
  const lowStockCount = inventoryItems.filter((i) => i.currentStock <= i.minStock).length;
  const baseTime = new Date(currentDate).getTime() || new Date().getTime();
  const expiringSoonCount = inventoryBatches.filter((b) => {
    const diffDays = (new Date(b.expirationDate).getTime() - baseTime) / (1000 * 3600 * 24);
    return diffDays <= 45 && b.quantity > 0;
  }).length;

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault();
    setMoveError(null);

    if (!selectedItem) return;
    const res = recordInventoryMovement(selectedItem.id, moveType, Number(moveQuantity), moveReason);

    if (!res.success) {
      setMoveError(res.error || 'Error al registrar movimiento.');
      return;
    }

    setShowMovementModal(false);
    setMoveQuantity(1);
    setMoveReason('Aplicación en consulta médica');
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem(
      {
        code: itemCode,
        name: itemName,
        category: itemCategory,
        minStock: Number(itemMinStock),
        unit: itemUnit,
        location: itemLocation,
        requiresPrescription: itemRequiresRx,
        active: true,
      },
      {
        batchNumber: initBatchNumber || `LOT-${Date.now().toString().slice(-5)}`,
        expirationDate: initExpiration,
        quantity: Number(initQuantity),
        unitCost: Number(initCost),
      }
    );
    setShowNewItemModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Control Sanitario de Fármacos e Insumos
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Estrategia FEFO Activa
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Inventario Clínico, Lotes & Ledger Inmutable
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMovementModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Registrar Movimiento (Kardex)</span>
          </button>

          <button
            onClick={() => setShowNewItemModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400 dark:text-white" />
            <span>+ Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors duration-200">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Catálogo Activo
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{inventoryItems.length} Insumos</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Fármacos, descartables y anestesia</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors duration-200">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Alertas de Stock Bajo
          </span>
          <div className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
            {lowStockCount} Productos
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Por debajo de stock de seguridad</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors duration-200">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Próximos a Vencer (FEFO)
          </span>
          <div className={`text-2xl font-bold ${expiringSoonCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
            {expiringSoonCount} Lotes Críticos
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Caducidad en menos de 45 días</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors duration-200">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Movimientos Auditados
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{inventoryMovements.length} Registros</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Ledger inmutable 100% trazable</span>
        </div>
      </div>

      {/* Sub-Tabs: Catálogo & Lotes vs. Kardex Ledger Inmutable */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'catalog'
              ? 'border-slate-900 dark:border-emerald-500 text-slate-900 dark:text-slate-100 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Catálogo & Desglose de Lotes (FEFO)
        </button>
        <button
          onClick={() => setActiveSubTab('kardex')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'kardex'
              ? 'border-slate-900 dark:border-emerald-500 text-slate-900 dark:text-slate-100 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Ledger Inmutable de Movimientos (Kardex)
        </button>
      </div>

      {activeSubTab === 'catalog' ? (
        /* Two Column Layout: Catalog List + Selected Item Batch Explorer */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Items Table */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 transition-colors duration-200">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por nombre, código o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto pr-1 no-scrollbar text-xs">
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isLow = item.currentStock <= item.minStock;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {item.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Ubicación: {item.location} • Categoría: {item.category}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-bold font-mono ${
                          isLow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {item.currentStock} {item.unit}
                      </span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                        Mín: {item.minStock} {item.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: FEFO Batches for Selected Item */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 transition-colors duration-200">
            {selectedItem ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedItem.name}</h3>
                      {selectedItem.requiresPrescription && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          Requiere Receta Médica
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      Código: {selectedItem.code} • Stock Total: {selectedItem.currentStock} {selectedItem.unit}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300">
                  <div className="flex items-center gap-1.5 font-bold mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Prioridad de Consumo FEFO (First Expired, First Out):</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                    Cualquier salida de este insumo se descuenta automáticamente del lote con fecha de caducidad más cercana para evitar caducidad en anaquel.
                  </p>
                </div>

                {/* Batches Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Lotes Activos en Almacén ({itemBatches.length}):
                  </h4>

                  {itemBatches.length === 0 ? (
                    <p className="text-slate-400 dark:text-slate-500 text-xs italic">Sin lotes registrados.</p>
                  ) : (
                    <div className="space-y-2">
                      {itemBatches.map((batch, idx) => {
                        const isFirstOut = idx === 0;
                        const daysLeft = (new Date(batch.expirationDate).getTime() - baseTime) / (1000 * 3600 * 24);
                        const isExpiredSoon = daysLeft <= 55 && daysLeft > 0;

                        return (
                          <div
                            key={batch.id}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                              isFirstOut
                                ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                                : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                                <span>{batch.batchNumber}</span>
                                {isFirstOut && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                                    1º en salir (FEFO)
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                                Caducidad: <span className={isExpiredSoon ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>{batch.expirationDate}</span> • Costo Unit: ${batch.unitCost}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 block">
                                {batch.quantity} {selectedItem.unit}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">En existencia</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-xs">Selecciona un insumo para inspeccionar sus lotes.</p>
            )}
          </div>
        </div>
      ) : (
        /* KARDEX: Immutable Ledger of Inventory Movements */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Tipo Movimiento</th>
                  <th className="py-3 px-4">Insumo / Fármaco</th>
                  <th className="py-3 px-4">Cantidad</th>
                  <th className="py-3 px-4">Saldo (Previo → Nuevo)</th>
                  <th className="py-3 px-4">Motivo / Justificación</th>
                  <th className="py-3 px-4">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {inventoryMovements.map((mov) => {
                  const isEntry = mov.type === 'entrada';
                  const isDamage = mov.type === 'merma';

                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {mov.timestamp}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isEntry
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : isDamage
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                              : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300'
                          }`}
                        >
                          {isEntry ? (
                            <ArrowDownRight className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          {mov.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {mov.itemName}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap text-slate-900 dark:text-slate-100">
                        {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {mov.previousStock} → <span className="font-bold text-slate-900 dark:text-slate-100">{mov.newStock}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {mov.reason}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {mov.performer}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Registrar Movimiento */}
      {showMovementModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Registrar Movimiento en Ledger Inmutable
              </h3>
              <button
                onClick={() => setShowMovementModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {moveError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{moveError}</span>
              </div>
            )}

            <form onSubmit={handleRecordMovement} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="inv-move-item" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Insumo:</label>
                <select
                  id="inv-move-item"
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Stock: {item.currentStock} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inv-move-type" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tipo de Operación:</label>
                  <select
                    id="inv-move-type"
                    value={moveType}
                    onChange={(e) => setMoveType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="salida_consulta">Salida a Consulta</option>
                    <option value="entrada">Entrada / Reabastecimiento</option>
                    <option value="merma">Merma / Caducado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inv-move-qty" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Cantidad:</label>
                  <input
                    id="inv-move-qty"
                    type="number"
                    min={1}
                    value={moveQuantity}
                    onChange={(e) => setMoveQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inv-move-reason" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Motivo Mandatorio (Requerido por Auditoría):
                </label>
                <input
                  id="inv-move-reason"
                  type="text"
                  placeholder="Ej. Aplicado en curación, Factura #402, Frasco dañado..."
                  value={moveReason}
                  onChange={(e) => setMoveReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  Confirmar Transacción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nuevo Producto */}
      {showNewItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Alta de Producto en Catálogo
              </h3>
              <button
                onClick={() => setShowNewItemModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="item-code" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Código Único:</label>
                  <input
                    id="item-code"
                    type="text"
                    placeholder="Ej. MED-IBU-40"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="item-category" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Categoría:</label>
                  <select
                    id="item-category"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="medicamento">Medicamento</option>
                    <option value="insumo">Insumo Quirúrgico</option>
                    <option value="anestesia">Anestesia</option>
                    <option value="descartable">Descartable</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="item-name" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nombre Comercial / Genérico:</label>
                <input
                  id="item-name"
                  type="text"
                  placeholder="Ej. Ibuprofeno 400mg Comprimidos"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="item-unit" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Unidad:</label>
                  <input
                    id="item-unit"
                    type="text"
                    placeholder="cajas/piezas"
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="item-min-stock" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Stock Mín:</label>
                  <input
                    id="item-min-stock"
                    type="number"
                    value={itemMinStock}
                    onChange={(e) => setItemMinStock(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="item-location" className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Ubicación:</label>
                  <input
                    id="item-location"
                    type="text"
                    value={itemLocation}
                    onChange={(e) => setItemLocation(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Initial Batch */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase">
                  Lote Inicial (FEFO):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="item-batch-number" className="text-[10px] text-slate-500 dark:text-slate-400 block">Número de Lote:</label>
                    <input
                      id="item-batch-number"
                      type="text"
                      placeholder="LOT-2026..."
                      value={initBatchNumber}
                      onChange={(e) => setInitBatchNumber(e.target.value)}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="item-batch-exp" className="text-[10px] text-slate-500 dark:text-slate-400 block">Caducidad:</label>
                    <input
                      id="item-batch-exp"
                      type="date"
                      value={initExpiration}
                      onChange={(e) => setInitExpiration(e.target.value)}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="item-batch-qty" className="text-[10px] text-slate-500 dark:text-slate-400 block">Cantidad Inicial:</label>
                    <input
                      id="item-batch-qty"
                      type="number"
                      value={initQuantity}
                      onChange={(e) => setInitQuantity(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="item-batch-cost" className="text-[10px] text-slate-500 dark:text-slate-400 block">Costo Unitario ($):</label>
                    <input
                      id="item-batch-cost"
                      type="number"
                      value={initCost}
                      onChange={(e) => setInitCost(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rxCheckbox"
                  checked={itemRequiresRx}
                  onChange={(e) => setItemRequiresRx(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="rxCheckbox" className="text-slate-700 dark:text-slate-300 text-[11px] cursor-pointer">
                  Requiere prescripción médica obligatoria
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewItemModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
