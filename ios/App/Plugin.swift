import Foundation
import Capacitor
import CoreBluetooth

@objc(SoccerBluetoothPlugin)
public class SoccerBluetoothPlugin: CAPPlugin {
    var centralManager: CBCentralManager!
    var discoveredPeripherals: [CBPeripheral] = []
    var connectedPeripheral: CBPeripheral?
    var discoveredServices: [CBService] = []
    var sensorCharacteristic: CBCharacteristic?

    public override func load() {
        self.centralManager = CBCentralManager(delegate: self, queue: nil)
    }

    @objc func initialize(_ call: CAPPluginCall) {
        call.resolve(["initialized": true])
    }

    @objc func requestLEScan(_ call: CAPPluginCall) {
        discoveredPeripherals.removeAll()
        centralManager.scanForPeripherals(withServices: nil, options: nil)
        notifyListeners("scanStarted", data: [:])
        call.resolve(["status": "scanning"])
    }

    @objc func stopLEScan(_ call: CAPPluginCall) {
        centralManager.stopScan()
        notifyListeners("scanStopped", data: [:])
        call.resolve(["status": "stopped"])
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

// MARK: - BLE Delegates

extension SoccerBluetoothPlugin: CBCentralManagerDelegate, CBPeripheralDelegate {
    public func centralManagerDidUpdateState(_ central: CBCentralManager) {
        if central.state != .poweredOn {
            notifyListeners("bluetoothDisabled", data: [
                "state": "\(central.state.rawValue)"
            ])
        }
    }

    public func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
                               advertisementData: [String : Any], rssi RSSI: NSNumber) {
        if !discoveredPeripherals.contains(peripheral) {
            discoveredPeripherals.append(peripheral)
        }

        notifyListeners("scanResult", data: [
            "deviceId": peripheral.identifier.uuidString,
            "name": peripheral.name ?? "Unknown",
            "rssi": RSSI
        ])
    }

    public func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        peripheral.delegate = self
        peripheral.discoverServices(nil)
        notifyListeners("connected", data: [
            "deviceId": peripheral.identifier.uuidString
        ])
    }

    public func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        guard error == nil else { return }

        if let services = peripheral.services {
            self.discoveredServices = services
            notifyListeners("servicesDiscovered", data: [
                "deviceId": peripheral.identifier.uuidString,
                "serviceCount": services.count
            ])

            for service in services {
                peripheral.discoverCharacteristics(nil, for: service)
            }
        }
    }

    public func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        guard error == nil else { return }

        if let characteristics = service.characteristics {
            for characteristic in characteristics {
                // Assume only one characteristic with notify property is your sensor data
                if characteristic.properties.contains(.notify) {
                    self.sensorCharacteristic = characteristic
                    peripheral.setNotifyValue(true, for: characteristic)
                }
            }
        }
    }

    public func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        guard error == nil, let data = characteristic.value else { return }

        if let jsonString = String(data: data, encoding: .utf8),
           let jsonData = jsonString.data(using: .utf8) {
            do {
                if let parsed = try JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any] {
                    notifyListeners("onSensorData", data: parsed)
                }
            } catch {
                print("Failed to parse sensor data JSON")
            }
        }
    }
}
