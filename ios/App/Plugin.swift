import Foundation
import Capacitor
import CoreBluetooth

@objc(BluetoothLePlugin)
public class BluetoothLePlugin: CAPPlugin {
    var centralManager: CBCentralManager!
    var discoveredPeripherals: [CBPeripheral] = []
    var connectedPeripheral: CBPeripheral?
    var discoveredServices: [CBService] = []

    public override func load() {
        self.centralManager = CBCentralManager(delegate: self, queue: nil)
    }

    @objc func initialize(_ call: CAPPluginCall) {
        call.resolve(["initialized": true])
    }

    @objc func connect(_ call: CAPPluginCall) {
        guard let deviceId = call.getString("deviceId") else {
            call.reject("Device ID is required")
            return
        }

        if let peripheral = discoveredPeripherals.first(where: { $0.identifier.uuidString == deviceId }) {
            self.connectedPeripheral = peripheral
            self.centralManager.connect(peripheral, options: nil)
            call.resolve(["connected": true])
        } else {
            call.reject("Peripheral not found")
        }
    }

    @objc func getServices(_ call: CAPPluginCall) {
        guard let peripheral = self.connectedPeripheral else {
            call.reject("No connected peripheral")
            return
        }

        self.discoveredServices = []
        peripheral.discoverServices(nil)
        call.resolve(["servicesRequested": true])
    }
}

extension BluetoothLePlugin: CBCentralManagerDelegate, CBPeripheralDelegate {
    public func centralManagerDidUpdateState(_ central: CBCentralManager) {
        // handle different Bluetooth states
    }

    public func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
                               advertisementData: [String : Any], rssi RSSI: NSNumber) {
        discoveredPeripherals.append(peripheral)
    }

    public func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        peripheral.delegate = self
        peripheral.discoverServices(nil)
    }

    public func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        if let services = peripheral.services {
            self.discoveredServices = services
        }
    }
}
