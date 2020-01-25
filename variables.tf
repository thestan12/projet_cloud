provider "azurerm" {
  version = ">=1.30.0"

  subscription_id = "${var.subscription_id}"
  client_id       = "${var.client_id}"
  client_secret   = "${var.client_secret}"
  tenant_id       = "${var.tenant_id}"
}

variable "tenant_id" {
  description = "Enter tenant_id"
}
variable "subscription_id" {
  description = "Enter subscription_id"
}
variable "client_id" {
  description = "Enter client_id"
}
variable "client_secret" {
  description = "Enter client_secret"
}
