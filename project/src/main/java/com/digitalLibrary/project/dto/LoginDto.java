package com.digitalLibrary.project.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;


@Data
public class LoginDto {
    @Getter
    @Setter
    private String email;
    private String password;
}
