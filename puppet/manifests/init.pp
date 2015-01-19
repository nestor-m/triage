class triage {

  class { 'triage::database': }
  
  class { 'triage::runtime': }
  
  class { 'triage::service': 
    require => [Class['triage::runtime'], Class['triage::database']]
  }
}
