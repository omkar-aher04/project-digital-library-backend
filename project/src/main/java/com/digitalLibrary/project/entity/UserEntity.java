package com.digitalLibrary.project.entity;

import com.digitalLibrary.project.enums.SubscriptionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data

public class UserEntity {
    @Id
    @Column(name = "id") @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "firstName",nullable = false)
    private String firstName;
    @Column(name = "lastName",nullable = false)
    private String lastName;
    @Column(name = "email", nullable = false)
    private String email;
    @Column(name = "dob" ,nullable = false)
    private LocalDate dob;

    @Column(name = "subscription_type", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private SubscriptionType subscriptionType = SubscriptionType.NOT_SUBSCRIBED;
}
