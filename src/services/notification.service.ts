import { messaging } from "../config"; // Importamos la config del paso 1

class NotificationService {
    
    /**
     * Envía una notificación push al tópico 'low_stock'
     */
    async sendLowStockAlert(productId: string | number, productName: string, currentStock: number) {
        try {
            const message = {
                notification: {
                    title: `🚨 Stock Crítico: ${productName}`,
                    body: `Quedan solo ${currentStock} unidades. Reponer inventario.`,
                },
                data: {
                    type: 'LOW_STOCK',
                    productId: String(productId),
                    currentStock: String(currentStock),
                    timestamp: Date.now().toString(),
                },
                topic: 'low_stock', // El app Flutter debe suscribirse a este tópico
            };

            const response = await messaging.send(message);
            console.log(`[FCM] Notificación enviada para ${productName}: ${response}`);
            return true;
        } catch (error) {
            console.error('[FCM] Error al enviar notificación:', error);
            return false;
        }
    }
}

export const NotificationServices = new NotificationService();