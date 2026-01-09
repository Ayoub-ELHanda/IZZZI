output "dns_records" {
  description = "DNS records created"
  value = {
    root = var.domain_name != "" ? digitalocean_record.root[0].fqdn : ""
    www  = var.domain_name != "" ? digitalocean_record.www[0].fqdn : ""
    api  = var.domain_name != "" ? digitalocean_record.api[0].fqdn : ""
  }
}
