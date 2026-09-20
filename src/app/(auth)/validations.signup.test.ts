import {describe, expect, it} from "vitest"
import {Signup} from "./validations"

describe("Signup validation", () => {
  const base = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    password: "password12",
    passwordConfirmation: "password12",
    isProducer: false,
  }

  it("accepts a valid USER signup", () => {
    const data = Signup.parse(base)
    expect(data.name).toBe("Ada Lovelace")
    expect(data.email).toBe("ada@example.com")
    expect(data.isProducer).toBe(false)
  })

  it("accepts producer checkbox", () => {
    const data = Signup.parse({...base, isProducer: true})
    expect(data.isProducer).toBe(true)
  })

  it("rejects password mismatch", () => {
    expect(() =>
      Signup.parse({...base, passwordConfirmation: "different99"}),
    ).toThrow()
  })

  it("rejects empty name", () => {
    expect(() => Signup.parse({...base, name: "   "})).toThrow()
  })
})
