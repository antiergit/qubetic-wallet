//
//  Network.swift
//  WalletKit
//
//  Created by yuzushioh on 2018/01/24.
//  Copyright © 2018 yuzushioh. All rights reserved.
//

public enum Network {
    case main
    case test
    case ltc
    case bch
    case doge
    

    public var privateKeyVersion: UInt32 {
        switch self {
        case .main:
            return 0x0488ADE4
        case .test:
            return 0x04358394
        case .ltc:
            return 0x019D9CFE
        case .bch:
            return 0x04358394
        case .doge:
            return 0x0488E1F4
        }
    }
    
    public var publicKeyVersion: UInt32 {
        switch self {
        case .main:
            return 0x0488B21E
        case .test:
            return 0x043587CF
        case .ltc:
            return 0x043587CF
        case .bch:
            return 0x043587CF
        case .doge:
            return 0x0488E1F4
        }
    }
    
    public var privateKeyBIP49Version: UInt32 {
        switch self {
        case .main:
            return 0x049D7878
        case .test:
            return 0x044A4E28
        case .ltc:
            return 0x044A4E28
        case .bch:
            return 0x044A4E28
        case .doge:
            return 0x044A4E28
        }
        
    }
    
    public var publicKeyBIP49Version: UInt32 {
        switch self {
        case .main:
            return 0x049D7CB2
        case .test:
            return 0x044A5262
        case .ltc:
            return 0x044A5262
        case .bch:
            return 0x044A5262
        case .doge:
            return 0x044A5262
        }
    }

    public var privateKeyBIP84Version: UInt32 {
        switch self {
        case .main:
            return 0x04B2430C
        case .test:
            return 0x045F18BC
        case .ltc:
            return 0x01b26792
        case .bch:
            return 0x0488ade4
        case .doge:
            return 0x02fac398
        }
    }
    
    public var publicKeyBIP84Version: UInt32 {
        switch self {
        case .main:
            return 0x04B24746
        case .test:
            return 0x045F1CF6
        case .ltc:
            return 0x01b26ef6
        case .bch:
            return 0x0488b21e
        case .doge:
            return 0x02facafd
        }
    }
    
    public var publicKeyHash: UInt8 {
        switch self {
        case .main:
            return 0x00
        case .test:
            return 0x6f
        case .ltc:
            return 0x30
        case .bch:
            return 0x00
        case .doge:
            return 0x1E
        }
    }
    
    public var scriptHash: UInt8 {
        switch self {
        case .main:
            return 0x05
        case .test:
            return 0xc4
        case .ltc:
            return 0xc4
        case .bch:
            return 0x05
        case .doge:
            return 0x16
        }
    }
    
    public var bech32: String {
        switch self {
        case .main:
            return "bc"
        case .test:
            return "tb"
        case .ltc:
            return "ltc"
        case .bch:
            return "bc"
        case .doge:
            return ""
        }
    }
    
    public var coinType: UInt32 {
        switch self {
        case .main:
            return 0
        case .test:
            return 1
        case .ltc:
            return 2
        case .bch:
            return 145
        case .doge:
            return 3
        }
    }
}
